import { Observable } from "rxjs"
import { MessagingServerMessageAdditionalInfo } from "./server/types"

/**
 * PUBLIC types
 */

export type Message<B = any, S = any, Addition = {}> = {
    id: string
    timestamp: string
    source: S // TODO this contains information about device
    body: B
} & Addition

export type MessageHandler<In, Out = In, Deps = any> = (
    message$: Observable<Message<In>>,
    deps: Deps
) => Observable<Message<Out>>

export type ServerMessageHandler<In, Out = In, Deps = any> = (
    message$: Observable<Message<In, any, MessagingServerMessageAdditionalInfo>>,
    deps: Deps
) => Observable<Message<Out, any, MessagingServerMessageAdditionalInfo>>

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
