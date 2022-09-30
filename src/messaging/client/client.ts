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
import { fromClientDataReceived } from "./operators/fromClientDataReceived"
import { MessagingClientConfiguration } from "./types"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { serializeDataObject } from "../functions/serializeDataObject"
import { fromClientStatusEvent } from "./operators/fromClientStatusEvent"
import { composeMessageObject } from "../functions/composeMessageObject"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"
import { log } from "../../utils/operators/log"
import { ofClientStatusEvent } from "./operators/ofClientStatusEvent"
import { pingClient } from "./operators/pingClient"
import { PING_INTERVAL, PING_RETRY } from "../constants"
import { fromClientMessageReceived } from "./operators/fromClientMessageReceived"

export class MessagingClient<In, Out = In, Deps = any> {
    private readonly clientId: string
    private readonly handler$: Subject<MessageHandler<In, Deps>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly dataOutput$: Subject<DataObject>
    private readonly tcpClient: TCPClient
    private readonly statusEvent$: Observable<MessagingClientStatusEvent>

    private logger: Logger | null = DefaultLogger
    private config: MessagingClientConfiguration | null = null
    private mainSubscription: Subscription | null = null
    private dataSubscription: Subscription | null = null
    private pingSubscription: Subscription | null = null

    constructor(id: string) {
        this.clientId = id
        this.handler$ = new Subject<MessageHandler<In, Deps>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.dataOutput$ = new Subject<DataObject>()
        this.statusEvent$ = fromClientStatusEvent(this.clientId).pipe(
            log(this.logger, `MessagingClient [${this.clientId}] - status event`),
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

    start(
        config: MessagingClientConfiguration,
        rootHandler: MessageHandler<In, Deps>,
        dependencies: Deps
    ): Observable<void> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingClient [${this.clientId}] - start`, config)
        }
        this.config = config
        this.cleanSubscriptions()

        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Deps>, Deps]) => {
                return fromClientMessageReceived<In>(this.clientId, this.logger).pipe(
                    handleBy(handler, deps),
                    catchError((err) => {
                        this.logger?.error(`MessagingClient [${this.clientId}] fromClientDataReceived - error`, {
                            error: err,
                            ...("getMetadata" in err ? { metadata: err.getMetadata() } : {}),
                        })
                        return EMPTY
                    })
                )
            })
        )

        const data$: Observable<boolean> = this.dataOutput$.pipe(concatMap((data: DataObject) => this.sendData(data)))

        const ping$: Observable<boolean> = this.statusEvent$.pipe(
            ofClientStatusEvent(MessagingClientStatusEventName.Ready),
            switchMap(() => {
                return pingClient(
                    this.statusEvent$,
                    fromClientDataReceived(this.clientId),
                    this.dataOutput$,
                    this.config?.ping?.timeout ?? PING_INTERVAL * PING_RETRY
                ).pipe(
                    catchError((err) => {
                        this.logger?.error(`MessagingClient [${this.clientId}] - ping timed out`, err)
                        return defer(() => this.tcpClient.stop(MessagingStoppedReason.PingTimedOut)).pipe(
                            mapTo(false),
                            catchError((e) => {
                                this.logger?.error(`MessagingClient [${this.clientId}] - stop client failed - error`, e)
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

        return defer(() => this.tcpClient.start(config))
    }

    send(body: Out): Observable<any> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingClient [${this.clientId}] - sending message`, {
                body: body,
            })
        }
        return this.sendMessage(body)
    }

    stop(): Observable<void> {
        if (this.logger?.verbosity !== LoggerVerbosity.JustError) {
            this.logger?.log(`MessagingClient [${this.clientId}] - stop`)
        }
        this.cleanSubscriptions()
        this.config = null
        return defer(() => this.tcpClient.stop())
    }

    restart(): Observable<void> {
        return concat(
            defer(() => this.tcpClient.stop(MessagingStoppedReason.Restart)).pipe(
                catchError((err) => {
                    this.logger?.error(`MessagingClient [${this.clientId}] - restart - failed to stop`, err)
                    return []
                })
            ),
            defer(() => {
                if (this.config == null) {
                    return throwError(`MessagingClient [${this.clientId}] - restart - no config`)
                }
                return this.tcpClient.start(this.config)
            }).pipe(
                catchError((err) => {
                    this.logger?.error(`MessagingClient [${this.clientId}] - restart - failed to start`, err)
                    return throwError(err)
                })
            )
        )
    }

    getStatusEvent$(): Observable<MessagingClientStatusEvent> {
        return this.statusEvent$
    }

    getConfig(): MessagingClientConfiguration | null {
        return this.config
    }

    setLogger(logger: Logger | null): void {
        this.logger = logger
        if (this.logger?.verbosity === LoggerVerbosity.TCP) {
            this.tcpClient.setLogger(logger)
        } else {
            this.tcpClient.setLogger(null)
        }
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
        const config = this.getConfig()
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
            if (this.logger?.verbosity !== LoggerVerbosity.JustError && data.type !== DataObjectType.Ping) {
                this.logger?.log(`MessagingClient [${this.clientId}] - sending data`, {
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
