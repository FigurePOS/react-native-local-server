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

/**
 * Object containing Caller ID configuration
 * @property port - port on which the server will listen (default: {@link CALLER_ID_PORT})
 * @property numberOfDroppedBytesFromMsgStart - number of bytes to drop from the beginning of the message (default: {@link CALLER_ID_DROPPED_BYTES})
 * @property deduplicationTime - time in milliseconds for which the same call will be ignored (default: {@link CALLER_ID_DEDUPLICATION_TIME})
 */
export type CallerIdConfiguration = {
    port?: number
    numberOfDroppedBytesFromMsgStart?: number
    deduplicationTime?: number
}
