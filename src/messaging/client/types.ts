import { MessagingServiceInformation, MessagingStoppedReason } from "../types"

/**
 * Object containing configuration of messaging client
 * @property host - target host address
 * @property port - target port
 * @property name - name of the server
 * @property serviceId - public id of the client
 * @property ping - ping configuration of the client
 */
export type MessagingClientConfiguration = {
    host: string
    port: number

    name?: string
    serviceId?: string
    ping?: MessagingClientPingConfiguration
}

/**
 * @property timeout - defines how long should client wait for the ping (in ms)
 */
export type MessagingClientPingConfiguration = {
    timeout?: number
}

export enum MessagingClientStatusEventName {
    Ready = "Ready",
    Stopped = "Stopped",
    ServiceInformationChanged = "ServiceInformationChanged",

    Unknown = "Unknown",
}

export type MessagingClientLifecycleStatusEvent = {
    type:
        | MessagingClientStatusEventName.Ready
        | MessagingClientStatusEventName.Stopped
        | MessagingClientStatusEventName.Unknown
    reason?: MessagingStoppedReason | string
}

export type MessagingClientServiceInformationStatusEvent = {
    type: MessagingClientStatusEventName.ServiceInformationChanged
    info: MessagingServiceInformation
}

export type MessagingClientStatusEvent =
    | MessagingClientLifecycleStatusEvent
    | MessagingClientServiceInformationStatusEvent
