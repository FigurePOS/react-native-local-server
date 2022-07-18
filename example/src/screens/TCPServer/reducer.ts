import { Maybe, StateAction } from "../../types"
import { Reducer } from "redux"
import { TCPServerState } from "./types"
import { TCP_SERVER_START_REQUESTED, TCP_SERVER_STOP_REQUESTED } from "./actions"

export type TCPServerStateObject = {
    state: TCPServerState
    port: Maybe<string>
}

export const createDefaultDevicesState = (): TCPServerStateObject => ({
    state: TCPServerState.StandBy,
    port: "",
})

export const TCPServerReducer: Reducer = (
    state: TCPServerStateObject = createDefaultDevicesState(),
    action: StateAction
): TCPServerStateObject => {
    switch (action.type) {
        case TCP_SERVER_START_REQUESTED:
            return {
                ...state,
                state: TCPServerState.Starting,
            }
        case TCP_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: TCPServerState.ShuttingDown,
            }
        default:
            return state
    }
}
