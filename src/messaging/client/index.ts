import { defer, merge, Observable, of, Subject, Subscription } from "rxjs"
import { TCPClient } from "../../"
import { catchError, map, mapTo, mergeMap, switchMap, withLatestFrom } from "rxjs/operators"
import { Message, MessageHandler } from "../types"
import { handleBy } from "../operators/handleBy"
import { fromClientDataReceived } from "./operators/fromClientDataReceived"
import { ofDataTypeMessage } from "../operators/ofDataType"
import { deduplicateBy } from "../operators/deduplicateBy"
import { getMessageDeduplicationId } from "../functions/getMessageDeduplicationId"
import { fromClientEvent } from "./operators/fromClientEvent"
import { MessagingClientConfiguration } from "./types"

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
    ): Observable<any> {
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Out>, Deps]): Observable<Message<Out>> => {
                return fromClientDataReceived(this.clientId).pipe(
                    ofDataTypeMessage,
                    map((data): Message<In> => data.message),
                    // todo ack
                    // todo deduplication
                    deduplicateBy(getMessageDeduplicationId),
                    // todo sequence
                    handleBy(handler, deps)
                )
            }),
            mergeMap((message: Message<Out>) =>
                defer(() => {
                    const serialized = serializeMessage(message)
                    return this.tcpClient.sendData(serialized)
                }).pipe(
                    mapTo(true),
                    catchError(() => {
                        // TODO handle error
                        return of(false)
                    })
                )
            )
        )

        this.mainSubscription = output$.subscribe((sent) => {
            console.log("Message sent: " + sent)
        })

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpClient.start(config)).pipe(
            switchMap(() =>
                merge(
                    fromClientEvent(this.clientId, TCPClient.EventName.Ready),
                    fromClientEvent(this.clientId, TCPClient.EventName.Stopped),
                    this.error$
                )
            )
        )
    }

    send(message: Message<Out>): Observable<any> {
        // TODO this is duplicate
        return defer(() => {
            const serialized = serializeMessage(message)
            return this.tcpClient.sendData(serialized)
        }).pipe(
            mapTo(true),
            catchError(() => {
                // TODO handle error
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

export const serializeMessage = <T>(message: Message<T>): string => {
    // TODO validity checks
    return JSON.stringify(message)
}
