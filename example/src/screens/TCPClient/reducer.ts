import { prepend } from "ramda"
import { Reducer } from "redux"

import { MessageData } from "../../common/components/messaging/types"
import { ClientState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    BARE_TCP_CLIENT_ERRORED,
    BARE_TCP_CLIENT_NEW_DATA,
    BARE_TCP_CLIENT_START_REQUESTED,
    BARE_TCP_CLIENT_STATE_CHANGED,
    BARE_TCP_CLIENT_STOP_REQUESTED,
} from "./actions"

export type TCPClientStateObject = {
    state: ClientState
    port: string
    host: string
    error: Maybe<string>
    data: MessageData[]
}

export const createDefaultState = (): TCPClientStateObject => ({
    state: ClientState.StandBy,
    port: "12000",
    host: "localhost",
    error: null,
    data: [],
})

export const TCPClientReducer: Reducer = (
    state: TCPClientStateObject = createDefaultState(),
    action: StateAction,
): TCPClientStateObject => {
    switch (action.type) {
        case BARE_TCP_CLIENT_START_REQUESTED:
            return {
                ...state,
                state: ClientState.Starting,
            }
        case BARE_TCP_CLIENT_STOP_REQUESTED:
            return {
                ...state,
                state: ClientState.ShuttingDown,
            }
        case BARE_TCP_CLIENT_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
            }
        case BARE_TCP_CLIENT_ERRORED:
            return {
                ...state,
                state: ClientState.Error,
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
