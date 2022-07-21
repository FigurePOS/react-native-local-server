import { defer, from, Observable, of, Subject, Subscription } from "rxjs"
import { MessagingClientStatusEvent, TCPClient } from "../../"
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
import { getMessageData } from "../functions/getMessageData"
import { parseClientMessage } from "../functions/parseMessage"
import { fromClientStatusEvent } from "./operators/fromClientStatusEvent"
import { composeMessageObject } from "../functions/composeMessageObject"

export class MessagingClient<In, Out = In, Deps = any> {
    private readonly clientId: string
    private readonly handler$: Subject<MessageHandler<In, Out>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly tcpClient: TCPClient

    private config: MessagingClientConfiguration | null = null
    private mainSubscription: Subscription | null = null

    constructor(id: string) {
        this.clientId = id
        this.handler$ = new Subject<MessageHandler<In, Out>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()

        this.tcpClient = new TCPClient(id)
    }

    start(
        config: MessagingClientConfiguration,
        rootHandler: MessageHandler<In, Out>,
        dependencies: Deps
    ): Observable<MessagingClientStatusEvent> {
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Out>, Deps]) => {
                return fromClientDataReceived(this.clientId).pipe(
                    ofDataTypeMessage,
                    map(parseClientMessage),
                    deduplicateBy(getMessageData(getMessageId)),
                    handleBy(handler, deps)
                )
            }),
            concatMap(([body, _]: [Out, null]) => {
                const message = composeMessageObject(body, this.getSourceData())
                const data = composeDataMessageObject(message)
                return this.sendData(data)
            })
        )

        this.mainSubscription = output$.subscribe(() => {})

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpClient.start(config)).pipe(
            switchMap(() => {
                return fromClientStatusEvent(this.clientId)
            })
        )
    }

    send(body: Out): Observable<any> {
        const message = composeMessageObject(body, this.getSourceData())
        const data = composeDataMessageObject(message)
        return this.sendData(data)
    }

    stop(): Observable<any> {
        if (this.mainSubscription) {
            this.mainSubscription.unsubscribe()
            this.mainSubscription = null
        }
        this.config = null
        return defer(() => this.tcpClient.stop())
    }

    getConfig(): MessagingClientConfiguration | null {
        return this.config
    }

    private getSourceData(): MessageSource {
        const config = this.getConfig()
        return {
            ...(config ? { name: config.name } : null),
            ...(config ? { serviceId: config.serviceId } : null),
            connectionId: "",
        }
    }

    private sendData(data: DataObject, t: number = 500): Observable<boolean> {
        return defer(() => {
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
