import { defer, from, Observable, of, Subject, Subscription } from "rxjs"
import { TCPServer } from "../../"
import { composeMessageObject } from "../functions/composeMessageObject"
import { catchError, concatMap, map, mapTo, mergeMap, switchMap, timeout, withLatestFrom } from "rxjs/operators"
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
import { DataObject, MessageHandler, MessageSource } from "../types"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"
import { log } from "../operators/log"

export class MessagingServer<In, Out = In, Deps = any> {
    private readonly serverId: string
    private readonly handler$: Subject<MessageHandler<In, Out>>
    private readonly dep$: Subject<Deps>
    private readonly error$: Subject<any>
    private readonly tcpServer: TCPServer

    private logger: Logger | null = DefaultLogger
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
    ): Observable<MessagingServerStatusEvent> {
        this.logger?.log(`MessagingServer [${this.serverId}] - start`, config)
        this.config = config
        const output$: Observable<boolean> = this.handler$.pipe(
            withLatestFrom(this.dep$),
            mergeMap(([handler, deps]: [MessageHandler<In, Out>, Deps]) => {
                return fromServerDataReceived(this.serverId).pipe(
                    ofDataTypeMessage,
                    map(parseServerMessage),
                    deduplicateBy(getMessageData(getMessageId)),
                    log(this.logger, `MessagingServer [${this.serverId}] - received message`),
                    handleBy(handler, deps)
                )
            }),
            log(this.logger, `MessagingServer [${this.serverId}] - sending reply message`),
            concatMap(([body, info]: [Out, MessagingServerMessageAdditionalInfo]) => {
                const message = composeMessageObject(body, this.getSourceData(info.connectionId))
                const data = composeDataMessageObject(message)
                return this.sendData(data, info.connectionId)
            })
        )

        this.mainSubscription = output$.subscribe(() => {})

        this.dep$.next(dependencies)
        this.handler$.next(rootHandler)

        return defer(() => this.tcpServer.start(config)).pipe(
            switchMap(() => {
                return fromServerStatusEvent(this.serverId)
            }),
            log(this.logger, `MessagingServer [${this.serverId}] - status`)
        )
    }

    send(body: Out, connectionId: string): Observable<any> {
        this.logger?.log(`MessagingServer [${this.serverId}] - sending message`, {
            body: body,
            connectionId: connectionId,
        })
        const message = composeMessageObject(body, this.getSourceData(connectionId))
        const data = composeDataMessageObject(message)
        return this.sendData(data, connectionId)
    }

    closeConnection(connectionId: string): Observable<any> {
        this.logger?.log(`MessagingServer [${this.serverId}] - closing connection`, {
            connectionId: connectionId,
        })
        return defer(() => this.tcpServer.closeConnection(connectionId))
    }

    stop(): Observable<any> {
        this.logger?.log(`MessagingServer [${this.serverId}] - stop`)
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

    setLogger(logger: Logger | null): void {
        this.logger = logger
        this.tcpServer.setLogger(logger)
    }

    private getSourceData(connectionId: string): MessageSource {
        const config = this.getConfig()
        return {
            ...(config ? { name: config.name } : null),
            ...(config ? { serviceId: config.serviceId } : null),
            connectionId: connectionId,
        }
    }

    private sendData(data: DataObject, connectionId: string, t: number = 500): Observable<boolean> {
        return defer(() => {
            this.logger?.log(`MessagingServer [${this.serverId}] - sending data`, {
                data: data,
                connectionId: connectionId,
            })
            const serialized = serializeDataObject(data)
            return from(this.tcpServer.sendData(connectionId, serialized)).pipe(
                timeout(t),
                mapTo(true),
                catchError((err) => {
                    this.error$.next(err)
                    this.logger?.error(`MessagingServer [${this.serverId}] - send data error`, err)
                    return of(false)
                })
            )
        })
    }
}
