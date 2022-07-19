import { Maybe, StateAction } from "../../types"
import { Reducer } from "redux"
import { TCPServerState } from "./types"
import {
    BARE_TCP_SERVER_READY,
    BARE_TCP_SERVER_START_ERRORED,
    BARE_TCP_SERVER_START_FAILED,
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
    BARE_TCP_SERVER_STOPPED,
} from "./actions"

export type TCPServerStateObject = {
    state: TCPServerState
    port: Maybe<string>
    error: Maybe<string>
}

export const createDefaultDevicesState = (): TCPServerStateObject => ({
    state: TCPServerState.StandBy,
    port: "",
    error: null,
})

export const TCPServerReducer: Reducer = (
    state: TCPServerStateObject = createDefaultDevicesState(),
    action: StateAction
): TCPServerStateObject => {
    switch (action.type) {
        case BARE_TCP_SERVER_START_REQUESTED:
            return {
                ...state,
                port: action.payload.port,
                state: TCPServerState.Starting,
            }
        case BARE_TCP_SERVER_START_ERRORED:
        case BARE_TCP_SERVER_START_FAILED:
            return {
                ...state,
                error: action.payload.error,
                state: TCPServerState.Error,
            }
        case BARE_TCP_SERVER_READY:
            return {
                ...state,
                state: TCPServerState.Ready,
            }
        case BARE_TCP_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: TCPServerState.ShuttingDown,
            }

        case BARE_TCP_SERVER_STOPPED:
            return {
                ...state,
                state: action.payload.error ? TCPServerState.Error : TCPServerState.StandBy,
                error: action.payload.error,
            }
        default:
            return state
    }
}
