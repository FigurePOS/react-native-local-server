import { MessagingStoppedReason } from "../types"

/**
 * PUBLIC types
 */

/**
 * Object containing configuration of TCP server
 * @property port - port to listen on
 * @property name - name of the server
 * @property serviceId - public id of the server
 * @property ping - ping configuration of the server
 */
export type MessagingServerConfiguration = {
    port: number
    name?: string
    serviceId?: string

    ping?: MessagingServerPingConfiguration
}

/**
 * @property interval - defines how often is ping sent
 * @property timeout - defines how long should the server wait for response to ping
 * @property retryCount - defines how many pings can fail in a row before closing the connection
 */
export type MessagingServerPingConfiguration = {
    interval?: number
    timeout?: number
    retryCount?: number
}

export enum MessagingServerStatusEventName {
    Ready = "Ready",
    Stopped = "Stopped",
    ConnectionAccepted = "ConnectionAccepted",
    ConnectionReady = "ConnectionReady",
    ConnectionClosed = "ConnectionClosed",

    Unknown = "Unknown",
}

export type MessagingServerLifecycleStatusEvent = {
    type:
        | MessagingServerStatusEventName.Ready
        | MessagingServerStatusEventName.Stopped
        | MessagingServerStatusEventName.Unknown
    reason?: MessagingStoppedReason | string
}

export type MessagingServerConnectionStatusEvent = {
    type:
        | MessagingServerStatusEventName.ConnectionAccepted
        | MessagingServerStatusEventName.ConnectionReady
        | MessagingServerStatusEventName.ConnectionClosed
    connectionId: string
    reason?: MessagingStoppedReason | string
}

export type MessagingServerStatusEvent = MessagingServerLifecycleStatusEvent | MessagingServerConnectionStatusEvent
