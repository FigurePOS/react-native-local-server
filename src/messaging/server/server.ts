import { concat, defer, EMPTY, from, Observable, of, Subject, Subscription, throwError } from "rxjs"
import { LoggerVerbosity, MessagingServerConnectionStatusEvent, MessagingStoppedReason, TCPServer } from "../../"
import { composeMessageObject } from "../functions/composeMessageObject"
import {
    catchError,
    concatMap,
    groupBy,
    map,
    mapTo,
    mergeMap,
    share,
    tap,
    timeout,
    withLatestFrom,
} from "rxjs/operators"
import { handleBy } from "../operators/handleBy"
import {
    fromMessagingServerDataReceived,
    fromMessagingServerMessageReceived,
    fromMessagingServerStatusEvent,
    ofMessagingServerStatusEvent,
    pingMessagingServerConnection,
} from "./operators"
import { MessagingServerConfiguration, MessagingServerStatusEvent, MessagingServerStatusEventName } from "./types"
import { serializeDataObject } from "../functions/serializeDataObject"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { DataObject, DataObjectType, MessageHandler, MessageSource } from "../types"
import { log } from "../../utils/operators/log"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { Logger, LoggerWrapper } from "../../utils/logger"

export class MessagingServer<In, Out = In, Deps = any> {
    private readonly serverId: string
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly tcpServer: TCPServer
    private readonly statusEvent$: Observable<MessagingServerStatusEvent>

    private logger: LoggerWrapper = new LoggerWrapper()
    private configuration: MessagingServerConfiguration | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.serverId = id
        this.handler$ = new Subject<MessageHandler<In, Deps>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.statusEvent$ = fromMessagingServerStatusEvent(id).pipe(
            log(LoggerVerbosity.Low, this.logger, `MessagingServer [${this.serverId}] - status event`),
            tap((event) => {
                if (event.type === MessagingServerStatusEventName.Stopped) {
                    this.cleanSubscriptions()
                }
            }),
            share()
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
        dependencies: Deps
    ): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingServer [${this.serverId}] - start`, configuration)
        this.configuration = configuration
        this.cleanSubscriptions()

        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Deps>, Deps]) => {
                return fromMessagingServerMessageReceived<In>(this.serverId, this.logger).pipe(
                    handleBy(handler, deps),
                    catchError((err) => {
                        this.logger.error(LoggerVerbosity.Low, "fromServerDataReceived - error", {
                            error: err,
                            ...("getMetadata" in err ? { metadata: err.getMetadata() } : {}),
                        })
                        return EMPTY
                    })
                )
            })
        )

        const data$: Observable<boolean> = this.dataOutput$.pipe(
            groupBy((data: DataObject) => data.connectionId),
            mergeMap((group$) =>
                group$.pipe(
                    concatMap((data: DataObject) => {
                        if (!data.connectionId) {
                            this.logger.error(
                                LoggerVerbosity.Low,
                                `MessagingServer [${this.serverId}] - sending data without connection id`
                            )
                            return of(false)
                        }
                        return this.sendData(data, data.connectionId)
                    })
                )
            )
        )

        const ping$: Observable<boolean> = this.statusEvent$.pipe(
            ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionReady),
            map((e: MessagingServerConnectionStatusEvent) => e.connectionId),
            mergeMap((connectionId: string) => {
                return pingMessagingServerConnection(
                    connectionId,
                    this.statusEvent$,
                    fromMessagingServerDataReceived(this.serverId),
                    this.dataOutput$,
                    this.configuration?.ping?.interval ?? PING_INTERVAL,
                    this.configuration?.ping?.timeout ?? PING_INTERVAL,
                    this.configuration?.ping?.retryCount ?? PING_RETRY
                ).pipe(
                    catchError((err) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingServer [${this.serverId}] - error in ping stream - closing the connection ${connectionId}`,
                            err
                        )
                        return defer(() =>
                            this.tcpServer.closeConnection(connectionId, MessagingStoppedReason.PingTimedOut)
                        ).pipe(mapTo(false))
                    })
                )
            })
        )

        this.mainSubscription = output$.subscribe()
        this.dataSubscription = data$.subscribe()
        this.pingSubscription = ping$.subscribe()

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpServer.start(configuration))
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
        return defer(() => from(this.tcpServer.stop(reason)))
    }

    /**
     * This method restarts the server.
     */
    restart(): Observable<void> {
        return concat(
            defer(() => this.tcpServer.stop(MessagingStoppedReason.Restart)).pipe(
                catchError((err) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingServer [${this.serverId}] - restart - failed to stop`,
                        err
                    )
                    return []
                })
            ),
            defer(() => {
                if (this.configuration == null) {
                    return throwError(`MessagingServer [${this.serverId}] - restart - no config`)
                }
                return this.tcpServer.start(this.configuration)
            }).pipe(
                catchError((err) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingServer [${this.serverId}] - restart - failed to start`,
                        err
                    )
                    return throwError(err)
                })
            )
        )
    }

    /**
     * This method returns stream of all status events of the server.
     */
    getStatusEvent$(): Observable<MessagingServerStatusEvent> {
        return this.statusEvent$
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
    }

    private getSourceData(connectionId: string): MessageSource {
        const config = this.getConfiguration()
        return {
            ...(config ? { name: config.name } : null),
            ...(config ? { serviceId: config.serviceId } : null),
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
                mapTo(true),
                catchError((err) => {
                    this.error$.next(err)
                    this.logger.error(LoggerVerbosity.Low, `MessagingServer [${this.serverId}] - send data error`, err)
                    return of(false)
                })
            )
        })
    }
}
