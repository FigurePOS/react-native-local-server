import { Maybe, StateAction } from "../../../types"
import { Reducer } from "redux"
import { ClientState } from "../../../common/types"
import {
    COUNTER_CLIENT_ERRORED,
    COUNTER_CLIENT_START_REQUESTED,
    COUNTER_CLIENT_STATE_CHANGED,
    COUNTER_CLIENT_STOP_REQUESTED,
} from "./actions"

export type CounterClientStateObject = {
    state: ClientState
    host: Maybe<string>
    port: Maybe<string>
    error: Maybe<string>
}

export const createDefaultState = (): CounterClientStateObject => ({
    state: ClientState.StandBy,
    host: "192.168.1.70",
    port: "12000",
    error: null,
})

export const counterClientReducer: Reducer = (
    state: CounterClientStateObject = createDefaultState(),
    action: StateAction
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
        default:
            return state
    }
}
