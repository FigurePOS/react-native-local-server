import { defer, merge, Observable, of, Subject, Subscription } from "rxjs"
import { MessageHandler } from "../../.."
import { Message, TCPServer } from "../../"
import { catchError, map, mapTo, mergeMap, switchMap, withLatestFrom } from "rxjs/operators"
import { ofDataTypeMessage } from "../operators/ofDataType"
import { deduplicateBy } from "../operators/deduplicateBy"
import { getMessageDeduplicationId } from "../functions/getMessageDeduplicationId"
import { handleBy } from "../operators/handleBy"
import { fromServerDataReceived } from "./operators/fromServerDataReceived"
import { fromServerEvent } from "./operators/fromServerEvent"
import { MessagingServerConfiguration } from "./types"

export class MessagingServer<In, Out = In, Deps = any> {
    private readonly serverId: string
    private readonly handler$: Subject<MessageHandler<In, Out>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly tcpServer: TCPServer

    private config: MessagingServerConfiguration | null = null
    private mainSubscription: Subscription | null = null

    constructor(id: string) {
        this.serverId = id
        this.handler$ = new Subject<MessageHandler<In, Out>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()
        this.tcpServer = new TCPServer(id)
    }

    start(
        config: MessagingServerConfiguration,
        rootHandler: MessageHandler<In, Out>,
        dependencies: Deps
    ): Observable<any> {
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Out>, Deps]): Observable<Message<Out>> => {
                return fromServerDataReceived(this.serverId).pipe(
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
                    if (!message.connectionId) {
                        throw new Error("no connection id in message")
                    }
                    const serialized = serializeMessage(message)
                    return this.tcpServer.sendData(message.connectionId, serialized)
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

        return defer(() => this.tcpServer.start(config)).pipe(
            switchMap(() =>
                merge(
                    fromServerEvent(this.serverId, TCPServer.EventName.Ready),
                    fromServerEvent(this.serverId, TCPServer.EventName.Stopped),
                    fromServerEvent(this.serverId, TCPServer.EventName.ConnectionAccepted),
                    fromServerEvent(this.serverId, TCPServer.EventName.ConnectionReady),
                    fromServerEvent(this.serverId, TCPServer.EventName.ConnectionClosed),
                    this.error$
                )
            )
        )
    }

    send(message: Message<Out>): Observable<any> {
        // TODO this is duplicate
        return defer(() => {
            if (!message.connectionId) {
                throw new Error("no connection id in message")
            }
            const serialized = serializeMessage(message)
            return this.tcpServer.sendData(message.connectionId, serialized)
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
        return defer(() => this.tcpServer.stop())
    }

    getConfig(): MessagingServerConfiguration | null {
        return this.config
    }
}

export const serializeMessage = <T>(message: Message<T>): string => {
    // TODO validity checks
    return JSON.stringify(message)
}
