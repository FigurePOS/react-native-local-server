import { concat, defer, EMPTY, from, Observable, of, Subject, Subscription, throwError } from "rxjs"
import {
    LoggerVerbosity,
    MessagingClientStatusEvent,
    MessagingClientStatusEventName,
    MessagingStoppedReason,
    TCPClient,
} from "../../"
import { catchError, concatMap, mapTo, mergeMap, share, switchMap, tap, timeout, withLatestFrom } from "rxjs/operators"
import { DataObject, DataObjectType, MessageHandler, MessageSource } from "../types"
import { handleBy } from "../operators/handleBy"
import {
    fromMessagingClientDataReceived,
    fromMessagingClientMessageReceived,
    fromMessagingClientStatusEvent,
    ofMessagingClientStatusEvent,
    pingMessagingClient,
} from "./operators"
import { MessagingClientConfiguration } from "./types"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { serializeDataObject } from "../functions/serializeDataObject"
import { composeMessageObject } from "../functions/composeMessageObject"
import { log } from "../../utils/operators/log"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { Logger, LoggerWrapper } from "../../utils/logger"

export class MessagingClient<In, Out = In, Deps = any> {
    private readonly clientId: string
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly tcpClient: TCPClient
    private readonly statusEvent$: Observable<MessagingClientStatusEvent>

    private logger: LoggerWrapper = new LoggerWrapper()
    private configuration: MessagingClientConfiguration | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.clientId = id
        this.handler$ = new Subject<MessageHandler<In, Deps>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.statusEvent$ = fromMessagingClientStatusEvent(this.clientId).pipe(
            log(LoggerVerbosity.Low, this.logger, `MessagingClient [${this.clientId}] - status event`),
            tap((event) => {
                if (event.type === MessagingClientStatusEventName.Stopped) {
                    this.cleanSubscriptions()
                }
            }),
            share()
        )

        this.tcpClient = new TCPClient(id)
        this.tcpClient.setLogger(null)
    }

    /**
     * This method starts the client and connects to the server.
     * Once the MessagingClientStatusEventName.Ready event is emitted the client is ready to receive and send data.
     * @param configuration - configuration of the server
     * @param rootHandler - handler for incoming messages
     * @param dependencies - additional dependencies to pass into the handler
     */
    start(
        configuration: MessagingClientConfiguration,
        rootHandler: MessageHandler<In, Deps>,
        dependencies: Deps
    ): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - start`, configuration)
        this.configuration = configuration
        this.cleanSubscriptions()

        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Deps>, Deps]) => {
                return fromMessagingClientMessageReceived<In>(this.clientId, this.logger).pipe(
                    handleBy(handler, deps),
                    catchError((err) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingClient [${this.clientId}] fromClientDataReceived - error`,
                            {
                                error: err,
                                ...("getMetadata" in err ? { metadata: err.getMetadata() } : {}),
                            }
                        )
                        return EMPTY
                    })
                )
            })
        )

        const data$: Observable<boolean> = this.dataOutput$.pipe(concatMap((data: DataObject) => this.sendData(data)))

        const ping$: Observable<boolean> = this.statusEvent$.pipe(
            ofMessagingClientStatusEvent(MessagingClientStatusEventName.Ready),
            switchMap(() => {
                return pingMessagingClient(
                    this.statusEvent$,
                    fromMessagingClientDataReceived(this.clientId),
                    this.dataOutput$,
                    this.configuration?.ping?.timeout ?? PING_INTERVAL * PING_RETRY
                ).pipe(
                    catchError((err) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingClient [${this.clientId}] - ping timed out`,
                            err
                        )
                        return defer(() => this.tcpClient.stop(MessagingStoppedReason.PingTimedOut)).pipe(
                            mapTo(false),
                            catchError((e) => {
                                this.logger.error(
                                    LoggerVerbosity.Low,
                                    `MessagingClient [${this.clientId}] - stop client failed - error`,
                                    e
                                )
                                return of(false)
                            })
                        )
                    })
                )
            })
        )

        this.mainSubscription = output$.subscribe()
        this.dataSubscription = data$.subscribe()
        this.pingSubscription = ping$.subscribe()

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpClient.start(configuration))
    }

    /**
     * This method sends a message to the server.
     * @param body - a message body to be sent
     */
    send(body: Out): Observable<any> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - sending message`, {
            body: body,
        })
        return this.sendMessage(body)
    }

    /**
     * This method disconnects from the server.
     * @param reason - internal reason for closing the connection
     */
    stop(reason?: string): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - stop`, {
            reason: reason,
        })
        this.cleanSubscriptions()
        this.configuration = null
        return defer(() => this.tcpClient.stop(reason))
    }

    /**
     * This method restarts the connection to the server.
     */
    restart(): Observable<void> {
        return concat(
            defer(() => this.tcpClient.stop(MessagingStoppedReason.Restart)).pipe(
                catchError((err) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingClient [${this.clientId}] - restart - failed to stop`,
                        err
                    )
                    return []
                })
            ),
            defer(() => {
                if (this.configuration == null) {
                    return throwError(`MessagingClient [${this.clientId}] - restart - no config`)
                }
                return this.tcpClient.start(this.configuration)
            }).pipe(
                catchError((err) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingClient [${this.clientId}] - restart - failed to start`,
                        err
                    )
                    return throwError(err)
                })
            )
        )
    }

    /**
     * This method returns stream of all status events of the client.
     */
    getStatusEvent$(): Observable<MessagingClientStatusEvent> {
        return this.statusEvent$
    }

    /**
     * This method returns last configuration of the client.
     */
    getConfiguration(): MessagingClientConfiguration | null {
        return this.configuration
    }

    /**
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity?: LoggerVerbosity) => {
        this.logger.setLogger(logger, verbosity ?? LoggerVerbosity.Medium)
        this.tcpClient.setLogger(logger, verbosity)
    }

    private cleanSubscriptions() {
        this.mainSubscription?.unsubscribe()
        this.mainSubscription = null
        this.dataSubscription?.unsubscribe()
        this.dataSubscription = null
        this.pingSubscription?.unsubscribe()
        this.pingSubscription = null
    }

    private getSourceData(): MessageSource {
        const config = this.getConfiguration()
        return {
            ...(config ? { name: config.name } : null),
            ...(config ? { serviceId: config.serviceId } : null),
            connectionId: "",
        }
    }

    private sendMessage(body: Out): Observable<boolean> {
        const message = composeMessageObject(body, this.getSourceData())
        const data = composeDataMessageObject(message)
        this.dataOutput$.next(data)
        return of(true)
    }

    private sendData(data: DataObject, t: number = 500): Observable<boolean> {
        return defer(() => {
            if (data.type !== DataObjectType.Ping) {
                this.logger.log(LoggerVerbosity.High, `MessagingClient [${this.clientId}] - sending data`, {
                    data: data,
                })
            }
            const serialized = serializeDataObject(data)
            return from(this.tcpClient.sendData(serialized)).pipe(
                timeout(t),
                mapTo(true),
                catchError((err) => {
                    this.error$.next(err)
                    return of(false)
                })
            )
        })
    }
}
