export type MessagingClientConfiguration = {
    host: string
    port: number
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
}

export type MessagingClientStatusEvent = MessagingClientLifecycleStatusEvent
