import { Observable } from "rxjs"

/**
 * PUBLIC types
 */

export type Message<B = any> = {
    id: string
    timestamp: string
    source: MessageSource
    body: B
}

export type MessageHandler<In, Out = In, Deps = any> = (
    message$: Observable<Message<In>>,
    deps: Deps
) => Observable<Out>

/**
 * PRIVATE types
 */
export type MessageSource = {
    name?: string
    serviceId?: string
    connectionId: string
}

export enum DataObjectType {
    Message = "message",
    MessageAck = "message-ack",
}

export type DataObjectMessage<M = any> = {
    type: DataObjectType.Message
    message: Message<M>
}

export type DataObjectMessageAck = {
    type: DataObjectType.MessageAck
    messageId: string
}

export type DataObject<M = any> = DataObjectMessage<M> | DataObjectMessageAck
