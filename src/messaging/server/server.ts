import { defer, Observable, of, Subject, Subscription } from "rxjs"
import { Message, TCPServer } from "../../"
import { catchError, map, mapTo, mergeMap, switchMap, withLatestFrom } from "rxjs/operators"
import { ofDataTypeMessage } from "../operators/ofDataType"
import { deduplicateBy } from "../operators/deduplicateBy"
import { handleBy } from "../operators/handleBy"
import { fromServerDataReceived } from "./operators/fromServerDataReceived"
import { MessagingServerConfiguration, MessagingServerMessageAdditionalInfo, MessagingServerStatusEvent } from "./types"
import { getMessageId } from "../functions/getMessageId"
import { serializeDataObject } from "../functions/serializeDataObject"
import { composeDataMessageObject } from "../functions/composeDataMessageObject"
import { fromServerStatusEvent } from "./operators/fromServerStatusEvent"
import { parseServerMessage } from "../functions/parseMessage"
import { getMessageData } from "../functions/getMessageData"
import { ServerMessageHandler } from "../types"

export class MessagingServer<In, Out = In, Deps = any> {
    private readonly serverId: string
    private readonly handler$: Subject<ServerMessageHandler<In, Out>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly tcpServer: TCPServer

    private config: MessagingServerConfiguration | null = null
    private mainSubscription: Subscription | null = null

    constructor(id: string) {
        this.serverId = id
        this.handler$ = new Subject<ServerMessageHandler<In, Out>>()
        this.dep$ = new Subject<Deps>()
        this.error$ = new Subject<any>()

        this.tcpServer = new TCPServer(id)
    }

    start(
        config: MessagingServerConfiguration,
        rootHandler: ServerMessageHandler<In, Out>,
        dependencies: Deps
    ): Observable<MessagingServerStatusEvent> {
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(
                ([handler, deps]: [ServerMessageHandler<In, Out>, Deps]): Observable<
                    [Message<Out>, MessagingServerMessageAdditionalInfo]
                > => {
                    return fromServerDataReceived(this.serverId).pipe(
                        ofDataTypeMessage,
                        map(parseServerMessage),
                        deduplicateBy(getMessageData(getMessageId)),
                        handleBy(handler, deps)
                    )
                }
            ),
            mergeMap(([message, info]: [Message<Out>, MessagingServerMessageAdditionalInfo]) =>
                defer(() => {
                    const connectionId: string = info.connectionId
                    const serialized = serializeDataObject(composeDataMessageObject(message))
                    return this.tcpServer.sendData(connectionId, serialized)
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

        return defer(() => this.tcpServer.start(config)).pipe(
            switchMap(() => {
                return fromServerStatusEvent(this.serverId)
            })
        )
    }

    send(message: Message<Out>, connectionId: string): Observable<any> {
        // TODO this is duplicate
        return defer(() => {
            const serialized = serializeDataObject(composeDataMessageObject(message))
            return this.tcpServer.sendData(connectionId, serialized)
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
        return defer(() => this.tcpServer.stop())
    }

    getConfig(): MessagingServerConfiguration | null {
        return this.config
    }
}
