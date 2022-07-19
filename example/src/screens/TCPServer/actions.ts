import { Maybe } from "../../types"

export const BARE_TCP_SERVER_START_REQUESTED = "BARE_TCP_SERVER_START_REQUESTED"
export const createActionBareTcpServerStartRequested = (port: string) => ({
    type: BARE_TCP_SERVER_START_REQUESTED,
    payload: {
        port: port,
    },
})

export const BARE_TCP_SERVER_START_SUCCEEDED = "BARE_TCP_SERVER_START_SUCCEEDED"
export const createActionBareTcpServerStartSucceeded = () => ({
    type: BARE_TCP_SERVER_START_SUCCEEDED,
})

export const BARE_TCP_SERVER_START_FAILED = "BARE_TCP_SERVER_START_FAILED"
export const createActionBareTcpServerStartFailed = (error: string) => ({
    type: BARE_TCP_SERVER_START_FAILED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_START_ERRORED = "BARE_TCP_SERVER_START_ERRORED"
export const createActionBareTcpServerStartErrored = (error: string) => ({
    type: BARE_TCP_SERVER_START_ERRORED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_READY = "BARE_TCP_SERVER_READY"
export const createActionBareTcpServerReady = () => ({
    type: BARE_TCP_SERVER_READY,
})

export const BARE_TCP_SERVER_STOPPED = "BARE_TCP_SERVER_STOPPED"
export const createActionBareTcpServerStopped = (error: Maybe<string>) => ({
    type: BARE_TCP_SERVER_STOPPED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_STOP_REQUESTED = "BARE_TCP_SERVER_STOP_REQUESTED"
export const createActionBareTcpServerStopRequested = () => ({
    type: BARE_TCP_SERVER_STOP_REQUESTED,
})
