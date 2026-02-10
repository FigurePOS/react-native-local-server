import { prepend } from "ramda"
import { Reducer } from "redux"

import { MessageData } from "../../common/components/messaging/types"
import { ServerState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    BARE_UDP_SERVER_DATA_RECEIVED,
    BARE_UDP_SERVER_ERRORED,
    BARE_UDP_SERVER_READY,
    BARE_UDP_SERVER_START_FAILED,
    BARE_UDP_SERVER_START_REQUESTED,
    BARE_UDP_SERVER_STOP_REQUESTED,
    BARE_UDP_SERVER_STOPPED,
} from "./actions"

export type UDPServerStateObject = {
    state: ServerState
    port: Maybe<string>
    error: Maybe<string>
    data: MessageData[]
}

export const createDefaultState = (): UDPServerStateObject => ({
    state: ServerState.StandBy,
    port: "3520",
    error: null,
    data: [],
})

export const UDPServerReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: UDPServerStateObject = createDefaultState(),
    action: StateAction,
): UDPServerStateObject => {
    switch (action.type) {
        case BARE_UDP_SERVER_START_REQUESTED:
            return {
                ...state,
                port: action.payload.port,
                state: ServerState.Starting,
            }
        case BARE_UDP_SERVER_ERRORED:
        case BARE_UDP_SERVER_START_FAILED:
            return {
                ...state,
                error: action.payload.error,
                state: ServerState.Error,
            }
        case BARE_UDP_SERVER_READY:
            return {
                ...state,
                state: ServerState.Ready,
            }
        case BARE_UDP_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }
        case BARE_UDP_SERVER_STOPPED:
            return {
                ...state,
                state: action.payload.error ? ServerState.Error : ServerState.StandBy,
                error: action.payload.error,
            }
        case BARE_UDP_SERVER_DATA_RECEIVED:
            return {
                ...state,
                data: prepend(action.payload.data, state.data),
            }
        default:
            return state
    }
}
