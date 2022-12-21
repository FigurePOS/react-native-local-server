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

/**
 * Object containing options for call simulation
 * @property numberOfCalls - number of calls to simulate (default: 5)
 * @property interval - interval between calls in milliseconds (default: 200)
 */
export type CallerIdSimulateCallOptions = {
    numberOfCalls?: number
    interval?: number
}
