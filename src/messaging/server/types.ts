/**
 * PUBLIC types
 */

export type MessagingServerConfiguration = {
    port: number
    name?: string
    serviceId?: string
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
}

export type MessagingServerConnectionStatusEvent = {
    type:
        | MessagingServerStatusEventName.ConnectionAccepted
        | MessagingServerStatusEventName.ConnectionReady
        | MessagingServerStatusEventName.ConnectionClosed
    connectionId: string
}

export type MessagingServerStatusEvent = MessagingServerLifecycleStatusEvent | MessagingServerConnectionStatusEvent
