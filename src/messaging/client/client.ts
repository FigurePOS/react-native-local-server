import { defer, Observable, of, Subject, Subscription } from "rxjs"
import { MessagingClientStatusEvent, TCPClient } from "../../"
import { catchError, map, mapTo, mergeMap, switchMap, withLatestFrom } from "rxjs/operators"
import { Message, MessageHandler } from "../types"
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
            mergeMap(([handler, deps]: [MessageHandler<In, Out>, Deps]): Observable<[Message<Out>, null]> => {
                return fromClientDataReceived(this.clientId).pipe(
                    ofDataTypeMessage,
                    map(parseClientMessage),
                    deduplicateBy(getMessageData(getMessageId)),
                    handleBy(handler, deps)
                )
            }),
            mergeMap(([message]: [Message<Out>, null]) =>
                defer(() => {
                    const serialized = serializeDataObject(composeDataMessageObject(message))
                    return this.tcpClient.sendData(serialized)
                }).pipe(
                    mapTo(true),
                    catchError((err) => {
                        this.error$.next(err)
                        return of(false)
                    })
                )
            )
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

    send(message: Message<Out>): Observable<any> {
        // TODO this is duplicate
        return defer(() => {
            const serialized = serializeDataObject(composeDataMessageObject(message))
            return this.tcpClient.sendData(serialized)
        }).pipe(
            mapTo(true),
            catchError((err) => {
                this.error$.next(err)
                return of(false)
            })
        )
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
}
