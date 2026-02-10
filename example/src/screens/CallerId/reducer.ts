import { prepend } from "ramda"
import { Reducer } from "redux"

import { PhoneCall } from "@figuredev/react-native-local-server"

import { ServerState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    CALLER_ID_SERVER_CALL_DETECTED,
    CALLER_ID_SERVER_ERRORED,
    CALLER_ID_SERVER_READY,
    CALLER_ID_SERVER_START_FAILED,
    CALLER_ID_SERVER_START_REQUESTED,
    CALLER_ID_SERVER_STOP_REQUESTED,
    CALLER_ID_SERVER_STOPPED,
} from "./actions"

export type CallerIDServerStateObject = {
    state: ServerState
    error: Maybe<string>
    incomingCalls: PhoneCall[]
}

export const createDefaultState = (): CallerIDServerStateObject => ({
    state: ServerState.StandBy,
    error: null,
    incomingCalls: [],
})

export const CallerIdServerReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: CallerIDServerStateObject = createDefaultState(),
    action: StateAction,
): CallerIDServerStateObject => {
    switch (action.type) {
        case CALLER_ID_SERVER_START_REQUESTED:
            return {
                ...state,
                state: ServerState.Starting,
            }
        case CALLER_ID_SERVER_ERRORED:
        case CALLER_ID_SERVER_START_FAILED:
            return {
                ...state,
                error: action.payload.error,
                state: ServerState.Error,
            }
        case CALLER_ID_SERVER_READY:
            return {
                ...state,
                state: ServerState.Ready,
            }
        case CALLER_ID_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }
        case CALLER_ID_SERVER_STOPPED:
            return {
                ...state,
                state: action.payload.error ? ServerState.Error : ServerState.StandBy,
                error: action.payload.error,
            }
        case CALLER_ID_SERVER_CALL_DETECTED:
            return {
                ...state,
                incomingCalls: prepend(action.payload.call, state.incomingCalls),
            }
        default:
            return state
    }
}
