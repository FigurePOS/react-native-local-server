import { concat, defer, EMPTY, from, Observable, of, Subject, Subscription, throwError } from "rxjs"
import {
    catchError,
    concatMap,
    groupBy,
    map,
    mergeMap,
    share,
    switchMap,
    tap,
    timeout,
    withLatestFrom,
} from "rxjs/operators"

import { LoggerVerbosity, MessagingServerConnectionStatusEvent, MessagingStoppedReason, TCPServer } from "../../"
import { Logger, LoggerWrapper } from "../../utils/logger"
import { log } from "../../utils/operators/log"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { composeMessageObject } from "../functions"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { composeDataServiceInfoObject } from "../functions/composeDataServiceInfoObject"
import { serializeDataObject } from "../functions/serializeDataObject"
import { handleBy } from "../operators/handleBy"
import { DataObject, DataObjectType, MessageHandler, MessageSource } from "../types"

import { composeTCPServerConfiguration } from "./functions"
import {
    fromMessagingServerDataReceived,
    fromMessagingServerMessageReceived,
    fromMessagingServerStatusEvent,
    ofMessagingServerStatusEvent,
    pingMessagingServerConnection,
} from "./operators"

import { waitForMessagingServerStopped } from "./operators/waitForMessagingServerEvent"
import { MessagingServerConfiguration, MessagingServerStatusEvent, MessagingServerStatusEventName } from "./types"

export class MessagingServer<In, Out = In, Deps = any, HandlerOutput = any> {
    private readonly serverId: string
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly handlerOutput$: Subject<HandlerOutput>
    private readonly tcpServer: TCPServer
    private readonly statusEvent$: Observable<MessagingServerStatusEvent>

    private logger: LoggerWrapper = new LoggerWrapper()
    private configuration: MessagingServerConfiguration | null = null
    private startData: [MessageHandler<In, Deps>, Deps] | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null
    private infoSubscription: Subscription | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.serverId = id
        this.handler$ = new Subject<MessageHandler<In, Deps, HandlerOutput>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.handlerOutput$ = new Subject<HandlerOutput>()
        this.statusEvent$ = fromMessagingServerStatusEvent(id).pipe(
            log(LoggerVerbosity.Low, this.logger, `MessagingServer [${this.serverId}] - status event`),
            tap((event) => {
                if (event.type === MessagingServerStatusEventName.Stopped) {
                    this.cleanSubscriptions()
                }
            }),
            share(),
        )
        this.tcpServer = new TCPServer(id)
        this.tcpServer.setLogger(null)
    }

    /**
     * This method starts the server.
     * Once the MessagingServerStatusEventName.Ready event is emitted the server is ready to accept connections.
     * @param configuration - configuration of the server
     * @param rootHandler - handler for incoming messages
     * @param dependencies - additional dependencies to pass into the handler
     */
    start(
        configuration: MessagingServerConfiguration,
        rootHandler: MessageHandler<In, Deps>,
        dependencies: Deps,
    ): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - start`, configuration)
        this.configuration = configuration
        this.startData = [rootHandler, dependencies]
        this.cleanSubscriptions()

        const output$: Observable<HandlerOutput> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            switchMap(([handler, deps]: [MessageHandler<In, Deps, HandlerOutput>, Deps]) => {
                return fromMessagingServerMessageReceived<In>(this.serverId, this.logger).pipe(
                    handleBy(handler, deps),
                    tap((output) => this.handlerOutput$.next(output)),
                    catchError((err: unknown) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingServer [${this.serverId}] fatal error in output$`,
                            {
                                error: err,
                                ...("getMetadata" in err ? { metadata: err.getMetadata() } : {}),
                            },
                        )
                        // Because this stream errored, we need to restart the processing.
                        // This inserts the handler again into the handler subject, which re-triggers this switchMap.
                        this.handler$.next(handler)
                        return EMPTY
                    }),
                )
            }),
        )

        const data$: Observable<boolean> = this.dataOutput$.pipe(
            groupBy((data: DataObject) => data.connectionId),
            mergeMap((group$) =>
                group$.pipe(
                    concatMap((data: DataObject) => {
                        if (!data.connectionId) {
                            this.logger.error(
                                LoggerVerbosity.Low,
                                `MessagingServer [${this.serverId}] - sending data without connection id`,
                            )
                            return of(false)
                        }
                        return this.sendData(data, data.connectionId)
                    }),
                ),
            ),
        )

        const ping$: Observable<boolean> = this.statusEvent$.pipe(
            ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionReady),
            map((e: MessagingServerConnectionStatusEvent) => e.connectionId),
            mergeMap((connectionId: string) => {
                return pingMessagingServerConnection(
                    connectionId,
                    this.statusEvent$,
                    fromMessagingServerDataReceived(this.serverId, this.logger),
                    this.dataOutput$,
                    this.configuration?.ping?.interval ?? PING_INTERVAL,
                    this.configuration?.ping?.timeout ?? PING_INTERVAL,
                    this.configuration?.ping?.retryCount ?? PING_RETRY,
                ).pipe(
                    catchError((err: unknown) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingServer [${this.serverId}] - error in ping stream - closing the connection ${connectionId}`,
                            err,
                        )
                        return defer(() =>
                            this.tcpServer.closeConnection(connectionId, MessagingStoppedReason.PingTimedOut),
                        ).pipe(map(() => false))
                    }),
                )
            }),
        )

        const info$: Observable<boolean> = this.statusEvent$.pipe(
            ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionReady),
            map((e: MessagingServerConnectionStatusEvent) => e.connectionId),
            mergeMap((connectionId: string) => {
                if (!this.configuration?.service) {
                    this.logger.warn(
                        LoggerVerbosity.Low,
                        `MessagingServer [${this.serverId}] - service info - missing service configuration`,
                        this.configuration,
                    )
                    return of(false)
                }
                return this.sendData(composeDataServiceInfoObject(this.configuration.service), connectionId)
            }),
        )

        this.mainSubscription = output$.subscribe()
        this.dataSubscription = data$.subscribe()
        this.pingSubscription = ping$.subscribe()
        this.infoSubscription = info$.subscribe()

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        const tcpConfig = composeTCPServerConfiguration(configuration)
        return defer(() => this.tcpServer.start(tcpConfig))
    }

    /**
     * This method sends a message to target connection.
     * @param body - a message body to be sent
     * @param connectionId - target connection id
     */
    send(body: Out, connectionId: string): Observable<any> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - sending message`, {
            body: body,
            connectionId: connectionId,
        })
        return this.sendMessage(body, connectionId)
    }

    /**
     * This method closes active connection.
     * @param connectionId - target connection id
     * @param reason - internal reason for closing the connection
     */
    closeConnection(connectionId: string, reason?: string): Observable<any> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - closing connection`, {
            connectionId: connectionId,
            reason: reason,
        })
        return defer(() => this.tcpServer.closeConnection(connectionId, reason))
    }

    /**
     * This method returns an array of all active connection ids.
     */
    getConnectionIds(): Observable<string[]> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - get connection ids`)
        return defer(() => this.tcpServer.getConnectionIds())
    }

    /**
     * This method closes all active connections and stops the server from accepting new connections.
     * @param reason - reason for stopping the server
     */
    stop(reason?: string): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - stop`)
        this.cleanSubscriptions()
        this.configuration = null
        this.startData = null
        return defer(() => from(this.tcpServer.stop(reason)))
    }

    /**
     * This method restarts the server.
     */
    restart(): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - restart`)
        return concat(
            defer(() => this.tcpServer.stop(MessagingStoppedReason.Restart)).pipe(
                waitForMessagingServerStopped(this.serverId),
                catchError((err: unknown) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingServer [${this.serverId}] - restart - failed to stop`,
                        err,
                    )
                    return []
                }),
            ),
            defer(() => {
                if (this.configuration == null) {
                    return throwError(`MessagingServer [${this.serverId}] - restart - no config`)
                }
                if (this.startData == null) {
                    return throwError(`MessagingServer [${this.serverId}] - restart - no start data`)
                }
                return this.start(this.configuration, ...this.startData)
            }).pipe(
                catchError((err: unknown) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingServer [${this.serverId}] - restart - failed to start`,
                        err,
                    )
                    return throwError(err)
                }),
            ),
        )
    }

    /**
     * This method returns stream of all status events of the server.
     */
    getStatusEvent$(): Observable<MessagingServerStatusEvent> {
        return this.statusEvent$
    }

    /**
     * This method returns stream of outputs from all handlers.
     */
    getHandlerOutput$(): Observable<HandlerOutput> {
        return this.handlerOutput$
    }

    /**
     * This method returns last configuration of the server.
     */
    getConfiguration(): MessagingServerConfiguration | null {
        return this.configuration
    }

    /**
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity: LoggerVerbosity = LoggerVerbosity.Medium) => {
        this.logger.setLogger(logger, verbosity)
        this.tcpServer.setLogger(logger, verbosity - 1)
    }

    /**
     * This method returns local IP address.
     * If the device is not connected to any Wi-Fi it returns null.
     */
    getLocalIpAddress = (): Observable<string | null> => {
        return defer(() => this.tcpServer.getLocalIpAddress())
    }

    private cleanSubscriptions() {
        this.mainSubscription?.unsubscribe()
        this.mainSubscription = null
        this.dataSubscription?.unsubscribe()
        this.dataSubscription = null
        this.pingSubscription?.unsubscribe()
        this.pingSubscription = null
        this.infoSubscription?.unsubscribe()
        this.infoSubscription = null
    }

    private getSourceData(connectionId: string): MessageSource {
        const config = this.getConfiguration()
        return {
            ...(config ? { name: config.name } : null),
            ...(config && config.service ? { serviceId: config.service.id } : null),
            connectionId: connectionId,
        }
    }

    private sendMessage(body: Out, connectionId: string): Observable<boolean> {
        const message = composeMessageObject(body, this.getSourceData(connectionId))
        const data = composeDataMessageObject(message, connectionId)
        this.dataOutput$.next(data)
        return of(true)
    }

    private sendData(data: DataObject, connectionId: string, t: number = 500): Observable<boolean> {
        return defer(() => {
            if (data.type !== DataObjectType.Ping) {
                this.logger?.log(LoggerVerbosity.High, `MessagingServer [${this.serverId}] - sending data`, {
                    data: data,
                    connectionId: connectionId,
                })
            }
            const serialized = serializeDataObject(data)
            return from(this.tcpServer.sendData(connectionId, serialized)).pipe(
                timeout(t),
                map(() => true),
                catchError((err: unknown) => {
                    this.error$.next(err)
                    this.logger.error(LoggerVerbosity.Low, `MessagingServer [${this.serverId}] - send data error`, err)
                    return of(false)
                }),
            )
        })
    }
}
