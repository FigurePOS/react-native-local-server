import { Reducer } from "redux"

import { MessagingClientServiceSearchResult } from "@figuredev/react-native-local-server"

import { ClientState } from "../../../common/types"
import { Maybe, StateAction } from "../../../types"

import {
    COUNTER_CLIENT_AVAILABLE_SERVICES_CHANGED,
    COUNTER_CLIENT_ERRORED,
    COUNTER_CLIENT_SEARCH_ERRORED,
    COUNTER_CLIENT_SEARCH_RESTART_REQUESTED,
    COUNTER_CLIENT_SEARCH_START_REQUESTED,
    COUNTER_CLIENT_SEARCH_STATE_CHANGED,
    COUNTER_CLIENT_SEARCH_STOP_REQUESTED,
    COUNTER_CLIENT_START_REQUESTED,
    COUNTER_CLIENT_STATE_CHANGED,
    COUNTER_CLIENT_STOP_REQUESTED,
} from "./actions"

export type CounterClientStateObject = {
    state: ClientState
    host: Maybe<string>
    port: Maybe<string>
    error: Maybe<string>
    searchState: ClientState
    searchError: Maybe<string>
    availableServices: MessagingClientServiceSearchResult[]
}

export const createDefaultState = (): CounterClientStateObject => ({
    state: ClientState.StandBy,
    host: "10.14.200.39",
    port: "12000",
    error: null,
    searchState: ClientState.StandBy,
    searchError: null,
    availableServices: [],
})

export const counterClientReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: CounterClientStateObject = createDefaultState(),
    action: StateAction,
): CounterClientStateObject => {
    switch (action.type) {
        case COUNTER_CLIENT_START_REQUESTED:
            return {
                ...state,
                state: ClientState.Starting,
            }
        case COUNTER_CLIENT_STOP_REQUESTED:
            return {
                ...state,
                state: ClientState.ShuttingDown,
            }
        case COUNTER_CLIENT_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
            }
        case COUNTER_CLIENT_ERRORED:
            return {
                ...state,
                state: ClientState.Error,
                error: action.payload.error,
            }
        case COUNTER_CLIENT_SEARCH_START_REQUESTED:
        case COUNTER_CLIENT_SEARCH_RESTART_REQUESTED:
            return {
                ...state,
                searchState: ClientState.Starting,
            }
        case COUNTER_CLIENT_SEARCH_STOP_REQUESTED:
            return {
                ...state,
                searchState: ClientState.ShuttingDown,
            }
        case COUNTER_CLIENT_SEARCH_STATE_CHANGED:
            return {
                ...state,
                searchState: action.payload.state,
            }
        case COUNTER_CLIENT_SEARCH_ERRORED:
            return {
                ...state,
                searchState: ClientState.Error,
                searchError: action.payload.error,
            }
        case COUNTER_CLIENT_AVAILABLE_SERVICES_CHANGED:
            return {
                ...state,
                availableServices: action.payload.services,
            }
        default:
            return state
    }
}
