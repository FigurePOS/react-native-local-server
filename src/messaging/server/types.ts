import { MessagingServiceInformation, MessagingStoppedReason } from "../types"

/**
 * PUBLIC types
 */

/**
 * Object containing configuration of messaging server
 * @property port - port to listen on
 * @property name - name of the server
 * @property service - service information about the server
 * @property ping - ping configuration of the server
 */
export type MessagingServerConfiguration = {
    port: number
    name?: string
    service?: Omit<MessagingServiceInformation, "shortId">

    ping?: MessagingServerPingConfiguration
    discovery?: MessagingServerDiscoveryConfiguration
}

/**
 * @property interval - defines how often is ping sent (in ms)
 * @property timeout - defines how long should the server wait for response to ping (in ms)
 * @property retryCount - defines how many pings can fail in a row before closing the connection
 */
export type MessagingServerPingConfiguration = {
    interval?: number
    timeout?: number
    retryCount?: number
}

/**
 * @property name - name of the server (if not provided, combination of name and id from service is used)
 * @property group - group of the server
 */
export type MessagingServerDiscoveryConfiguration = {
    name?: string
    group: string
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
