import { Observable } from "rxjs"

/**
 * PUBLIC types
 */

export type Message<B = any, S = any> = {
    id: string
    timestamp: string
    source: S // TODO this contains information about device
    attributes: Partial<{
        sequenceId: string
        deduplicationId: string
    }>
    body: B
}

export type MessageHandler<In, Out = In, Deps = any> = (
    event$: Observable<Message<In>>,
    deps: Deps
) => Observable<Message<Out>>

/**
 * PRIVATE types
 */

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
