import { MessagingStoppedReason } from "../types"

export type MessagingClientConfiguration = {
    name?: string
    serviceId?: string
    host: string
    port: number

    pingTimeout?: number
}

export enum MessagingClientStatusEventName {
    Ready = "Ready",
    Stopped = "Stopped",

    Unknown = "Unknown",
}

export type MessagingClientLifecycleStatusEvent = {
    type:
        | MessagingClientStatusEventName.Ready
        | MessagingClientStatusEventName.Stopped
        | MessagingClientStatusEventName.Unknown
    reason?: MessagingStoppedReason | string
}

export type MessagingClientStatusEvent = MessagingClientLifecycleStatusEvent
