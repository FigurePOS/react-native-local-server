import { MessagingStoppedReason } from "../types"

/**
 * PUBLIC types
 */

export type MessagingServerConfiguration = {
    port: number
    name?: string
    serviceId?: string

    pingInterval?: number
    pingTimeout?: number
    pingRetryCount?: number
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
