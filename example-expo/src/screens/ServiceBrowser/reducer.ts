import { Reducer } from "redux"

import { ServerState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    SERVICE_BROWSER_ERRORED,
    SERVICE_BROWSER_SERVICE_FOUND,
    SERVICE_BROWSER_SERVICE_LOST,
    SERVICE_BROWSER_START_REQUESTED,
    SERVICE_BROWSER_STARTED,
    SERVICE_BROWSER_STOP_REQUESTED,
    SERVICE_BROWSER_STOPPED,
} from "./actions"

export type ServiceBrowserStateObject = {
    state: ServerState
    group: Maybe<string>
    error: Maybe<string>
    services: string[]
}

export const createDefaultState = (): ServiceBrowserStateObject => ({
    state: ServerState.StandBy,
    group: "_fgr-counter._tcp",
    error: null,
    services: [],
})

export const ServiceBrowserReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: ServiceBrowserStateObject = createDefaultState(),
    action: StateAction,
): ServiceBrowserStateObject => {
    switch (action.type) {
        case SERVICE_BROWSER_START_REQUESTED:
            return {
                ...state,
                state: ServerState.Starting,
                group: action.payload.group,
            }
        case SERVICE_BROWSER_STARTED:
            return {
                ...state,
                state: ServerState.Ready,
            }
        case SERVICE_BROWSER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }
        case SERVICE_BROWSER_STOPPED:
            return {
                ...state,
                state: ServerState.StandBy,
                services: [],
            }
        case SERVICE_BROWSER_ERRORED:
            return {
                ...state,
                state: ServerState.Error,
                error: action.payload.error,
            }
        case SERVICE_BROWSER_SERVICE_FOUND:
            return {
                ...state,
                services: [
                    ...state.services.filter((service) => service !== action.payload.service),
                    action.payload.service,
                ],
            }
        case SERVICE_BROWSER_SERVICE_LOST:
            return {
                ...state,
                services: state.services.filter((service) => service !== action.payload.service),
            }
        default:
            return state
    }
}
