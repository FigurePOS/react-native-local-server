import { concat, defer, EMPTY, from, Observable, of, Subject, Subscription, throwError, TimeoutError } from "rxjs"
import { catchError, concatMap, map, share, switchMap, tap, timeout, withLatestFrom } from "rxjs/operators"

import {
    LoggerVerbosity,
    MESSAGING_CLIENT_DEFAULT_TIMEOUT,
    MessagingClientServiceSearchEvent,
    MessagingClientStatusEvent,
    MessagingClientStatusEventName,
    MessagingStoppedReason,
    ServiceBrowser,
    ServiceBrowserConfiguration,
    TCPClient,
    TCPClientConfiguration,
} from "../../"
import { ErrorWithMetadata } from "../../utils/errors"
import { Logger, LoggerWrapper } from "../../utils/logger"
import { log } from "../../utils/operators/log"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { composeMessageObject } from "../functions"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { serializeDataObject } from "../functions/serializeDataObject"
import { handleBy } from "../operators/handleBy"
import { DataObject, DataObjectType, MessageHandler, MessageSource } from "../types"

import { composeTCPClientConfiguration, getBrowserIdFromMessagingClientId } from "./functions"
import {
    fromMessagingClientDataReceived,
    fromMessagingClientMessageReceived,
    fromMessagingClientStatusEvent,
    ofMessagingClientStatusEvent,
    pingMessagingClient,
    waitForMessagingClientStopped,
} from "./operators"
import { fromMessagingClientServiceSearchEvent } from "./operators/fromMessagingClientServiceSearchEvent"
import { MessagingClientConfiguration } from "./types"

export class MessagingClient<In, Out = In, Deps = any, HandlerOutput = any> {
    private readonly clientId: string
    private readonly browserId: string
    private readonly discoveryGroup: string | null = null
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly handlerOutput$: Subject<HandlerOutput>
    private readonly tcpClient: TCPClient
    private readonly serviceBrowser: ServiceBrowser
    private readonly statusEvent$: Observable<MessagingClientStatusEvent>
    private readonly searchEvent$: Observable<MessagingClientServiceSearchEvent>

    private logger: LoggerWrapper = new LoggerWrapper()
    private configuration: MessagingClientConfiguration | null = null
    private startData: [MessageHandler<In, Deps>, Deps] | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     * @param discoveryGroup - zero config discovery group (for _fgr-counter._tcp put only fgr-counter)
     */
    constructor(id: string, discoveryGroup?: string) {
        this.clientId = id
        this.browserId = getBrowserIdFromMessagingClientId(id)
        this.discoveryGroup = discoveryGroup ?? null
        this.handler$ = new Subject<MessageHandler<In, Deps, HandlerOutput>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.handlerOutput$ = new Subject<HandlerOutput>()
        this.statusEvent$ = fromMessagingClientStatusEvent(this.clientId, this.logger).pipe(
            log(LoggerVerbosity.Low, this.logger, `MessagingClient [${this.clientId}] - status event`),
            tap((event) => {
                if (event.type === MessagingClientStatusEventName.Stopped) {
                    this.cleanSubscriptions()
                }
            }),
            share(),
        )
        this.searchEvent$ = fromMessagingClientServiceSearchEvent(this.clientId).pipe(
            log(LoggerVerbosity.Low, this.logger, `MessagingClient [${this.clientId}] - search update`),
            share(),
        )

        this.tcpClient = new TCPClient(id)
        this.tcpClient.setLogger(null)
        this.serviceBrowser = new ServiceBrowser(this.browserId)
        this.serviceBrowser.setLogger(null)
    }

    /**
     * This method starts service search.
     * After this method is called, event {@link MessagingClientStatusEventName.ServiceSearchStarted} should appear in {@link getStatusEvent$()}.
     * Search updates are available in {@link getSearchUpdate$()}.
     */
    startServiceSearch(): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - startServiceSearch`)
        if (!this.discoveryGroup) {
            this.logger.error(LoggerVerbosity.Low, `MessagingClient [${this.clientId}] - missing discovery group`)
            return throwError(() => new Error("No discovery group provided"))
        }
        const config: ServiceBrowserConfiguration = {
            type: `_${this.discoveryGroup}._tcp`,
        }
        return defer(() => this.serviceBrowser.start(config))
    }

    /**
     * This method stops service search.
     * After this method is called, event {@link MessagingClientStatusEventName.ServiceSearchStopped} should appear in {@link getStatusEvent$()}.
     * Search updates in {@link getSearchUpdate$()} are reset.
     */
    stopServiceSearch(): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - stopServiceSearch`)
        return defer(() => this.serviceBrowser.stop())
    }

    /**
     * This method restarts the service search.
     * It's just a shortcut for {@link stopServiceSearch()} and {@link startServiceSearch()}.
     */
    restartServiceSearch(): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - restartServiceSearch`)
        return concat(
            defer(() => this.stopServiceSearch()).pipe(
                catchError((err: unknown) => {
                    this.logger.error(
                        LoggerVerbosity.Medium,
                        `MessagingClient [${this.clientId}] - restartServiceSearch error when stopping service search`,
                        {
                            error: err,
                        },
                    )
                    return []
                }),
            ),
            defer(() => this.startServiceSearch()),
        )
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
        dependencies: Deps,
    ): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - start`, configuration)
        this.configuration = configuration
        this.startData = [rootHandler, dependencies]
        this.cleanSubscriptions()
        const tcpConfig: TCPClientConfiguration | null = composeTCPClientConfiguration(
            configuration,
            this.discoveryGroup,
        )
        if (!tcpConfig) {
            this.logger.error(LoggerVerbosity.Low, `MessagingClient [${this.clientId}] - missing tcp configuration`)
            return throwError(() => new Error("Failed to prepare tcp configuration"))
        }

        const output$: Observable<HandlerOutput> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            switchMap(([handler, deps]: [MessageHandler<In, Deps, HandlerOutput>, Deps]) => {
                return fromMessagingClientMessageReceived<In>(this.clientId, this.logger).pipe(
                    handleBy(handler, deps),
                    tap((output) => this.handlerOutput$.next(output)),
                    catchError((err: unknown) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingClient [${this.clientId}] fatal error in output$`,
                            {
                                error: err,
                                ...(err instanceof ErrorWithMetadata ? { metadata: err.getMetadata() } : {}),
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

        const data$: Observable<boolean> = this.dataOutput$.pipe(concatMap((data: DataObject) => this.sendData(data)))

        const ping$: Observable<boolean> = this.statusEvent$.pipe(
            ofMessagingClientStatusEvent(MessagingClientStatusEventName.Ready),
            switchMap(() => {
                return pingMessagingClient(
                    this.statusEvent$,
                    fromMessagingClientDataReceived(this.clientId, this.logger),
                    this.dataOutput$,
                    this.configuration?.ping?.timeout ?? PING_INTERVAL * PING_RETRY,
                ).pipe(
                    catchError((err: unknown) => {
                        this.logger.error(
                            LoggerVerbosity.Low,
                            `MessagingClient [${this.clientId}] - ping timed out`,
                            err,
                        )
                        return defer(() => this.tcpClient.stop(MessagingStoppedReason.PingTimedOut)).pipe(
                            map(() => false),
                            catchError((e: unknown) => {
                                this.logger.error(
                                    LoggerVerbosity.Low,
                                    `MessagingClient [${this.clientId}] - stop client failed - error`,
                                    e,
                                )
                                return of(false)
                            }),
                        )
                    }),
                )
            }),
        )

        // eslint-disable-next-line @smarttools/rxjs/no-ignored-subscribe
        this.mainSubscription = output$.subscribe()
        // eslint-disable-next-line @smarttools/rxjs/no-ignored-subscribe
        this.dataSubscription = data$.subscribe()
        // eslint-disable-next-line @smarttools/rxjs/no-ignored-subscribe
        this.pingSubscription = ping$.subscribe()

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpClient.start(tcpConfig)).pipe(
            timeout(this.configuration?.connection.timeout ?? MESSAGING_CLIENT_DEFAULT_TIMEOUT),
            catchError((err: unknown) => {
                if (!(err instanceof TimeoutError)) {
                    return throwError(() => err)
                }
                return defer(() => this.tcpClient.stop(MessagingStoppedReason.ConnectionTimedOut)).pipe(
                    switchMap(() => throwError(() => err)),
                )
            }),
        )
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
        this.startData = null
        return defer(() => this.tcpClient.stop(reason))
    }

    /**
     * This method restarts the connection to the server.
     */
    restart(): Observable<void> {
        this.logger.log(LoggerVerbosity.Medium, `MessagingClient [${this.clientId}] - restart`)
        return concat(
            defer(() => this.tcpClient.stop(MessagingStoppedReason.Restart)).pipe(
                waitForMessagingClientStopped(this.clientId, this.logger),
                catchError((err: unknown) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingClient [${this.clientId}] - restart - failed to stop`,
                        err,
                    )
                    return []
                }),
            ),
            defer(() => {
                if (this.configuration == null) {
                    return throwError(() => new Error(`MessagingClient [${this.clientId}] - restart - no config`))
                }
                if (this.startData == null) {
                    return throwError(() => new Error(`MessagingClient [${this.clientId}] - restart - no start data`))
                }
                return this.start(this.configuration, ...this.startData)
            }).pipe(
                catchError((err: unknown) => {
                    this.logger.error(
                        LoggerVerbosity.Low,
                        `MessagingClient [${this.clientId}] - restart - failed to start`,
                        err,
                    )
                    return throwError(() => err)
                }),
            ),
        )
    }

    /**
     * This method returns stream of all status events of the client.
     */
    getStatusEvent$(): Observable<MessagingClientStatusEvent> {
        return this.statusEvent$
    }

    /**
     * This method returns stream of search updates.
     * For more information see {@link MessagingClientServiceSearchEvent}
     */
    getSearchUpdate$(): Observable<MessagingClientServiceSearchEvent> {
        return this.searchEvent$
    }

    /**
     * This method returns stream of outputs from all handlers.
     */
    getHandlerOutput$(): Observable<HandlerOutput> {
        return this.handlerOutput$
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
    setLogger = (logger: Logger | null, verbosity: LoggerVerbosity = LoggerVerbosity.Medium) => {
        this.logger.setLogger(logger, verbosity)
        this.tcpClient.setLogger(logger, verbosity - 1)
        this.serviceBrowser.setLogger(logger, verbosity - 1)
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
                map(() => true),
                catchError((err: unknown) => {
                    this.error$.next(err)
                    return of(false)
                }),
            )
        })
    }
}
