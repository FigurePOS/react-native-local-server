import { defer, EMPTY, from, Observable, of, Subject, Subscription } from "rxjs"
import { MessagingClientStatusEvent, MessagingClientStatusEventName, TCPClient } from "../../"
import { catchError, concatMap, map, mapTo, mergeMap, switchMap, timeout, withLatestFrom } from "rxjs/operators"
import { DataObject, MessageHandler, MessageSource } from "../types"
import { handleBy } from "../operators/handleBy"
import { fromClientDataReceived } from "./operators/fromClientDataReceived"
import { ofDataTypeMessage } from "../operators/ofDataType"
import { deduplicateBy } from "../operators/deduplicateBy"
import { MessagingClientConfiguration } from "./types"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { serializeDataObject } from "../functions/serializeDataObject"
import { getMessageId } from "../functions/getMessageId"
import { parseClientMessage } from "../functions/parseMessage"
import { fromClientStatusEvent } from "./operators/fromClientStatusEvent"
import { composeMessageObject } from "../functions/composeMessageObject"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"
import { log } from "../operators/log"
import { ofClientStatusEvent } from "./operators/ofClientStatusEvent"
import { pingClient } from "./operators/pingClient"
import { PING_INTERVAL, PING_RETRY } from "../constants"

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
        this.statusEvent$ = fromClientStatusEvent(this.clientId)

        this.tcpClient = new TCPClient(id)
    }

    start(
        config: MessagingClientConfiguration,
        rootHandler: MessageHandler<In, Deps>,
        dependencies: Deps
    ): Observable<void> {
        this.logger?.log(`MessagingClient [${this.clientId}] - start`, config)
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Deps>, Deps]) => {
                return fromClientDataReceived(this.clientId).pipe(
                    ofDataTypeMessage,
                    map(parseClientMessage),
                    deduplicateBy(getMessageId),
                    log(this.logger, `MessagingClient [${this.clientId}] - received message`),
                    handleBy(handler, deps),
                    catchError((err) => {
                        this.logger?.error("fromClientDataReceived - error", {
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
                    this.config?.pingTimeout ?? PING_INTERVAL * PING_RETRY
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
        this.logger?.log(`MessagingClient [${this.clientId}] - sending message`, {
            body: body,
        })
        return this.sendMessage(body)
    }

    stop(): Observable<void> {
        this.logger?.log(`MessagingClient [${this.clientId}] - stop`)
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
        return defer(() => this.tcpClient.stop())
    }

    getStatusEvent$(): Observable<MessagingClientStatusEvent> {
        return this.statusEvent$
    }

    getConfig(): MessagingClientConfiguration | null {
        return this.config
    }

    setLogger(logger: Logger | null): void {
        this.logger = logger
        this.tcpClient.setLogger(logger)
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
            this.logger?.log(`MessagingClient [${this.clientId}] - sending data`, {
                data: data,
            })
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
