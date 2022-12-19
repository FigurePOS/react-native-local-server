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

export type MessageHandler<In, Deps = any> = (message$: Observable<Message<In>>, deps: Deps) => Observable<any>

export enum MessagingStoppedReason {
    Manual = "manual",
    Restart = "restart",
    ClosedByPeer = "closed-by-peer",
    Invalidation = "invalidation",
    PingTimedOut = "ping-timed-out",
    ConnectionTimedOut = "connection-timed-out",
}

/**
 * Object containing public information about messaging service
 * @property name - name of the server
 * @property id - id of the service
 * @property shortId - short version of serviceId
 */
export type MessagingServiceInformation = {
    name: string
    id: string
    shortId: string
}

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
    Ping = "ping",
    ServiceInfo = "service-info",
}

export type DataObjectMessage<M = any> = {
    type: DataObjectType.Message
    message: Message<M>
    connectionId?: string
}

export type DataObjectMessageAck = {
    type: DataObjectType.MessageAck
    messageId: string
    connectionId?: string
}

export type DataObjectPing = {
    type: DataObjectType.Ping
    pingId: string
    connectionId?: string
}

export type DataObjectServiceInfo = {
    type: DataObjectType.ServiceInfo
    info: MessagingServiceInformation
    connectionId?: string
}

export const composeDataObjectPing = (pingId: string, connectionId?: string): DataObjectPing => ({
    type: DataObjectType.Ping,
    pingId: pingId,
    ...(connectionId ? { connectionId: connectionId } : null),
})

export type DataObject<M = any> = DataObjectMessage<M> | DataObjectMessageAck | DataObjectPing | DataObjectServiceInfo
