import { defer, fromEvent, merge, Observable, of, Subject } from "rxjs"
import { TCPClient } from "../../"
import { catchError, endWith, filter, map, mapTo, mergeMap, switchMap, takeUntil, withLatestFrom } from "rxjs/operators"
import { MessageHandler, Message } from "../types"
import { handleBy } from "../operators/handleBy"
import { fromClientDataReceived } from "./operators/fromClientDataReceived"
import { ofDataTypeMessage } from "../operators/ofDataType"
import { deduplicateBy } from "../operators/deduplicateBy"
import { getMessageDeduplicationId } from "../functions/getMessageDeduplicationId"

export class MessagingClient<In, Out = In, Deps = any> {
    private readonly clientId: string
    private readonly handler$: Subject<MessageHandler<In, Out>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly tcpClient: TCPClient

    constructor(id: string) {
        this.clientId = id
        this.handler$ = new Subject<MessageHandler<In, Out>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()

        this.tcpClient = new TCPClient(id)
    }

    start(rootHandler: MessageHandler<In, Out>, dependencies: Deps): Observable<any> {
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

        output$.subscribe((sent) => {
            console.log(sent)
        })

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        const config = {
            port: 12000,
            host: "localhost",
        }

        return defer(() => this.tcpClient.start(config)).pipe(
            switchMap(() => merge(fromEvent(TCPClient.EventEmitter, TCPClient.EventName.Ready), this.error$)),
            // @ts-ignore
            takeUntil(
                fromEvent(TCPClient.EventEmitter, TCPClient.EventName.Stopped).pipe(
                    filter((e: any) => e.clientId === this.tcpClient.getId())
                )
            ),
            endWith({ type: "stopped" })
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

    stop() {}
}

export const serializeMessage = <T>(message: Message<T>): string => {
    // TODO validity checks
    return JSON.stringify(message)
}
