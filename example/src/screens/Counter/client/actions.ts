import { ClientState } from "../../../common/types"

export const COUNTER_CLIENT_START_REQUESTED = "COUNTER_CLIENT_START_REQUESTED"
export const createActionCounterClientStartRequested = (host: string, port: string) => ({
    type: COUNTER_CLIENT_START_REQUESTED,
    payload: {
        host: host,
        port: port,
    },
})

export const COUNTER_CLIENT_STOP_REQUESTED = "COUNTER_CLIENT_STOP_REQUESTED"
export const createActionCounterClientStopRequested = () => ({
    type: COUNTER_CLIENT_STOP_REQUESTED,
})

export const COUNTER_CLIENT_ERRORED = "COUNTER_CLIENT_ERRORED"
export const createActionCounterClientErrored = (error: string) => ({
    type: COUNTER_CLIENT_ERRORED,
    payload: {
        error: error,
    },
})

export const COUNTER_CLIENT_STATE_CHANGED = "COUNTER_CLIENT_STATE_CHANGED"
export const createActionCounterClientStateChanged = (state: ClientState) => ({
    type: COUNTER_CLIENT_STATE_CHANGED,
    payload: {
        state: state,
    },
})
