import { Maybe, StateAction } from "../../../types"
import { Reducer } from "redux"
import { TCPClientState, TCPData } from "../common/types"
import {
    BARE_TCP_CLIENT_ERRORED,
    BARE_TCP_CLIENT_NEW_DATA,
    BARE_TCP_CLIENT_START_REQUESTED,
    BARE_TCP_CLIENT_STATE_CHANGED,
    BARE_TCP_CLIENT_STOP_REQUESTED,
} from "./actions"
import { prepend } from "ramda"

export type TCPClientStateObject = {
    state: TCPClientState
    port: string
    host: string
    error: Maybe<string>
    data: TCPData[]
}

export const createDefaultState = (): TCPClientStateObject => ({
    state: TCPClientState.StandBy,
    port: "12000",
    host: "localhost",
    error: null,
    data: [],
})

export const TCPClientReducer: Reducer = (
    state: TCPClientStateObject = createDefaultState(),
    action: StateAction
): TCPClientStateObject => {
    switch (action.type) {
        case BARE_TCP_CLIENT_START_REQUESTED:
            return {
                ...state,
                state: TCPClientState.Starting,
            }
        case BARE_TCP_CLIENT_STOP_REQUESTED:
            return {
                ...state,
                state: TCPClientState.ShuttingDown,
            }
        case BARE_TCP_CLIENT_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
            }
        case BARE_TCP_CLIENT_ERRORED:
            return {
                ...state,
                state: TCPClientState.Error,
                error: action.payload.error,
            }
        case BARE_TCP_CLIENT_NEW_DATA:
            return {
                ...state,
                data: prepend(action.payload.data, state.data),
            }
        default:
            return state
    }
}
