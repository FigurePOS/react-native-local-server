import { StopReason } from "../../utils/types"

export enum CallerIdServerStatusEventName {
    Ready = "Ready",
    Stopped = "Stopped",
    Unknown = "Unknown",
}

export type CallerIdServerStatusEvent = {
    type:
        | CallerIdServerStatusEventName.Ready
        | CallerIdServerStatusEventName.Stopped
        | CallerIdServerStatusEventName.Unknown
    reason?: StopReason
}
