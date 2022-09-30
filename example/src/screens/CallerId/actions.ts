import { Maybe } from "../../types"
import { PhoneCall } from "@figuredev/react-native-local-server"

export const CALLER_ID_SERVER_START_REQUESTED = "CALLER_ID_SERVER_START_REQUESTED"
export const createActionCallerIdServerStartRequested = () => ({
    type: CALLER_ID_SERVER_START_REQUESTED,
})

export const CALLER_ID_SERVER_START_SUCCEEDED = "CALLER_ID_SERVER_START_SUCCEEDED"
export const createActionCallerIdServerStartSucceeded = () => ({
    type: CALLER_ID_SERVER_START_SUCCEEDED,
})

export const CALLER_ID_SERVER_START_FAILED = "CALLER_ID_SERVER_START_FAILED"
export const createActionCallerIdServerStartFailed = (error: string) => ({
    type: CALLER_ID_SERVER_START_FAILED,
    payload: {
        error: error,
    },
})

export const CALLER_ID_SERVER_ERRORED = "CALLER_ID_SERVER_START_ERRORED"
export const createActionCallerIdServerErrored = (error: string) => ({
    type: CALLER_ID_SERVER_ERRORED,
    payload: {
        error: error,
    },
})

export const CALLER_ID_SERVER_READY = "CALLER_ID_SERVER_READY"
export const createActionCallerIdServerReady = () => ({
    type: CALLER_ID_SERVER_READY,
})

export const CALLER_ID_SERVER_STOPPED = "CALLER_ID_SERVER_STOPPED"
export const createActionCallerIdServerStopped = (error: Maybe<string>) => ({
    type: CALLER_ID_SERVER_STOPPED,
    payload: {
        error: error,
    },
})

export const CALLER_ID_SERVER_STOP_REQUESTED = "CALLER_ID_SERVER_STOP_REQUESTED"
export const createActionCallerIdServerStopRequested = () => ({
    type: CALLER_ID_SERVER_STOP_REQUESTED,
})

export const CALLER_ID_SERVER_CALL_DETECTED = "CALLER_ID_SERVER_CALL_DETECTED"
export const createActionCallerIdServerCallDetected = (call: PhoneCall) => ({
    type: CALLER_ID_SERVER_CALL_DETECTED,
    payload: {
        call: call,
    },
})

export const CALLER_ID_SERVER_SIMULATE_CALL_REQUESTED = "CALLER_ID_SERVER_SIMULATE_CALL_REQUESTED"
export const createActionCallerIdServerSimulateCallRequested = (phoneNumber: string, name: string) => ({
    type: CALLER_ID_SERVER_SIMULATE_CALL_REQUESTED,
    payload: {
        phoneNumber: phoneNumber,
        name: name,
    },
})
