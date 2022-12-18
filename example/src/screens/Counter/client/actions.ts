import { ClientState } from "../../../common/types"
import { MessagingClientServiceSearchResult } from "@figuredev/react-native-local-server"

export const COUNTER_CLIENT_START_REQUESTED = "COUNTER_CLIENT_START_REQUESTED"
export const createActionCounterClientStartRequested = (host: string, port: string) => ({
    type: COUNTER_CLIENT_START_REQUESTED,
    payload: {
        host: host,
        port: port,
    },
})

export const COUNTER_CLIENT_START_FROM_SERVICE_REQUESTED = "COUNTER_CLIENT_START_FROM_SERVICE_REQUESTED"
export const createActionCounterClientStartFromServiceRequested = (serviceId: string) => ({
    type: COUNTER_CLIENT_START_FROM_SERVICE_REQUESTED,
    payload: {
        serviceId: serviceId,
    },
})

export const COUNTER_CLIENT_STOP_REQUESTED = "COUNTER_CLIENT_STOP_REQUESTED"
export const createActionCounterClientStopRequested = () => ({
    type: COUNTER_CLIENT_STOP_REQUESTED,
})

export const COUNTER_CLIENT_RESTART_REQUESTED = "COUNTER_CLIENT_RESTART_REQUESTED"
export const createActionCounterClientRestartRequested = () => ({
    type: COUNTER_CLIENT_RESTART_REQUESTED,
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

export const COUNTER_CLIENT_SEARCH_START_REQUESTED = "COUNTER_CLIENT_SEARCH_START_REQUESTED"
export const createActionCounterClientSearchStartRequested = () => ({
    type: COUNTER_CLIENT_SEARCH_START_REQUESTED,
})

export const COUNTER_CLIENT_SEARCH_STOP_REQUESTED = "COUNTER_CLIENT_SEARCH_STOP_REQUESTED"
export const createActionCounterClientSearchStopRequested = () => ({
    type: COUNTER_CLIENT_SEARCH_STOP_REQUESTED,
})

export const COUNTER_CLIENT_SEARCH_RESTART_REQUESTED = "COUNTER_CLIENT_SEARCH_RESTART_REQUESTED"
export const createActionCounterClientSearchRestartRequested = () => ({
    type: COUNTER_CLIENT_SEARCH_RESTART_REQUESTED,
})

export const COUNTER_CLIENT_SEARCH_STATE_CHANGED = "COUNTER_CLIENT_SEARCH_STATE_CHANGED"
export const createActionCounterClientSearchStateChanged = (state: ClientState) => ({
    type: COUNTER_CLIENT_SEARCH_STATE_CHANGED,
    payload: {
        state: state,
    },
})

export const COUNTER_CLIENT_SEARCH_ERRORED = "COUNTER_CLIENT_SEARCH_ERRORED"
export const createActionCounterClientSearchErrored = (error: string) => ({
    type: COUNTER_CLIENT_SEARCH_ERRORED,
    payload: {
        error: error,
    },
})

export const COUNTER_CLIENT_AVAILABLE_SERVICES_CHANGED = "COUNTER_CLIENT_AVAILABLE_SERVICES_CHANGED"
export const createActionCounterClientAvailableServicesChanged = (services: MessagingClientServiceSearchResult[]) => ({
    type: COUNTER_CLIENT_AVAILABLE_SERVICES_CHANGED,
    payload: {
        services: services,
    },
})
