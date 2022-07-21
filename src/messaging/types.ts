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

export type DataObjectMessage = {
    type: DataObjectType.Message
    message: any // TODO type this better
}

export type DataObjectMessageAck = {
    type: DataObjectType.MessageAck
    messageId: string
}

export type DataObject = DataObjectMessage | DataObjectMessageAck
