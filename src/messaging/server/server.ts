import { concat, defer, EMPTY, from, Observable, of, Subject, Subscription, throwError } from "rxjs"
import { LoggerVerbosity, MessagingServerConnectionStatusEvent, MessagingStoppedReason, TCPServer } from "../../"
import { composeMessageObject } from "../functions/composeMessageObject"
import { catchError, concatMap, groupBy, map, mapTo, mergeMap, share, timeout, withLatestFrom } from "rxjs/operators"
import { handleBy } from "../operators/handleBy"
import { fromServerDataReceived } from "./operators/fromServerDataReceived"
import { MessagingServerConfiguration, MessagingServerStatusEvent, MessagingServerStatusEventName } from "./types"
import { serializeDataObject } from "../functions/serializeDataObject"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { fromServerStatusEvent } from "./operators/fromServerStatusEvent"
import { DataObject, DataObjectType, MessageHandler, MessageSource } from "../types"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"
import { log } from "../operators/log"
import { ofServerStatusEvent } from "./operators/ofServerStatusEvent"
import { pingServerConnection } from "./operators/pingServerConnection"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { fromServerMessageReceived } from "./operators/fromServerMessageReceived"

export class MessagingServer<In, Out = In, Deps = any> {
    private readonly serverId: string
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly tcpServer: TCPServer
    private readonly statusEvent$: Observable<MessagingServerStatusEvent>

    private logger: Logger | null = DefaultLogger
    private config: MessagingServerConfiguration | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null

    constructor(id: string) {
        this.serverId = id
        this.handler$ = new Subject<MessageHandler<In, Deps>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.statusEvent$ = fromServerStatusEvent(id).pipe(
            log(this.logger, `MessagingServer [${this.serverId}] - status event`),
            share()
        )
        this.tcpServer = new TCPServer(id)
        this.tcpServer.setLogger(null)
    }

    start(
        config: MessagingServerConfiguration,
        rootHandler: MessageHandler<In, Deps>,
        dependencies: Deps
    ): Observable<void> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingServer [${this.serverId}] - start`, config)
        }
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Deps>, Deps]) => {
                return fromServerMessageReceived<In>(this.serverId, this.logger).pipe(
                    handleBy(handler, deps),
                    catchError((err) => {
                        this.logger?.error("fromServerDataReceived - error", {
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
                            this.logger?.error(
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
            ofServerStatusEvent(MessagingServerStatusEventName.ConnectionReady),
            map((e: MessagingServerConnectionStatusEvent) => e.connectionId),
            mergeMap((connectionId: string) => {
                return pingServerConnection(
                    connectionId,
                    this.statusEvent$,
                    fromServerDataReceived(this.serverId),
                    this.dataOutput$,
                    this.config?.ping?.interval ?? PING_INTERVAL,
                    this.config?.ping?.timeout ?? PING_INTERVAL,
                    this.config?.ping?.retryCount ?? PING_RETRY
                ).pipe(
                    catchError((err) => {
                        this.logger?.error(
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

        return defer(() => this.tcpServer.start(config))
    }

    send(body: Out, connectionId: string): Observable<any> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingServer [${this.serverId}] - sending message`, {
                body: body,
                connectionId: connectionId,
            })
        }
        return this.sendMessage(body, connectionId)
    }

    closeConnection(connectionId: string): Observable<any> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingServer [${this.serverId}] - closing connection`, {
                connectionId: connectionId,
            })
        }
        return defer(() => this.tcpServer.closeConnection(connectionId))
    }

    getConnectionIds(): Observable<string[]> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingServer [${this.serverId}] - get connection ids`)
        }
        return defer(() => this.tcpServer.getConnectionIds())
    }

    stop(): Observable<void> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingServer [${this.serverId}] - stop`)
        }
        if (this.mainSubscription) {
            this.mainSubscription.unsubscribe()
            this.mainSubscription = null
        }
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe()
            this.dataSubscription = null
        }
        if (this.pingSubscription) {
            this.pingSubscription.unsubscribe()
            this.pingSubscription = null
        }
        this.config = null
        return defer(() => from(this.tcpServer.stop()))
    }

    restart(): Observable<void> {
        return concat(
            defer(() => this.tcpServer.stop(MessagingStoppedReason.Restart)).pipe(
                catchError((err) => {
                    this.logger?.error(`MessagingServer [${this.serverId}] - restart - failed to stop`, err)
                    return []
                })
            ),
            defer(() => {
                if (this.config == null) {
                    return throwError(`MessagingServer [${this.serverId}] - restart - no config`)
                }
                return this.tcpServer.start(this.config)
            }).pipe(
                catchError((err) => {
                    this.logger?.error(`MessagingServer [${this.serverId}] - restart - failed to start`, err)
                    return throwError(err)
                })
            )
        )
    }

    getStatusEvent$(): Observable<MessagingServerStatusEvent> {
        return this.statusEvent$
    }

    getConfig(): MessagingServerConfiguration | null {
        return this.config
    }

    setLogger(logger: Logger | null): void {
        this.logger = logger
        if (this.logger?.verbosity === LoggerVerbosity.TCP) {
            this.tcpServer.setLogger(logger)
        } else {
            this.tcpServer.setLogger(null)
        }
    }

    getLocalIpAddress = (): Observable<string | null> => {
        return defer(() => this.tcpServer.getLocalIpAddress())
    }

    private getSourceData(connectionId: string): MessageSource {
        const config = this.getConfig()
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
            if (this.logger?.verbosity !== LoggerVerbosity.JustError && data.type !== DataObjectType.Ping) {
                this.logger?.log(`MessagingServer [${this.serverId}] - sending data`, {
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
                    this.logger?.error(`MessagingServer [${this.serverId}] - send data error`, err)
                    return of(false)
                })
            )
        })
    }
}
