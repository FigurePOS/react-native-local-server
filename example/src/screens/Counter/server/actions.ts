import { ServerConnectionState, ServerState } from "../../../common/types"

export const COUNTER_SERVER_START_REQUESTED = "COUNTER_SERVER_START_REQUESTED"
export const createActionCounterServerStartRequested = (port: string) => ({
    type: COUNTER_SERVER_START_REQUESTED,
    payload: {
        port: port,
    },
})

export const COUNTER_SERVER_STOP_REQUESTED = "COUNTER_SERVER_STOP_REQUESTED"
export const createActionCounterServerStopRequested = () => ({
    type: COUNTER_SERVER_STOP_REQUESTED,
})

export const COUNTER_SERVER_STATE_CHANGED = "COUNTER_SERVER_STATE_CHANGED"
export const createActionCounterServerStateChanged = (state: ServerState) => ({
    type: COUNTER_SERVER_STATE_CHANGED,
    payload: {
        state: state,
    },
})

export const COUNTER_SERVER_ERRORED = "COUNTER_SERVER_ERRORED"
export const createActionCounterServerErrored = (error: string) => ({
    type: COUNTER_SERVER_ERRORED,
    payload: {
        error: error,
    },
})

export const COUNTER_SERVER_CONNECTION_STATE_CHANGED = "COUNTER_SERVER_CONNECTION_STATE_CHANGED"
export const createActionCounterServerConnectionStateChanged = (
    connectionId: string,
    state: ServerConnectionState
) => ({
    type: COUNTER_SERVER_CONNECTION_STATE_CHANGED,
    payload: {
        connectionId: connectionId,
        state: state,
    },
})