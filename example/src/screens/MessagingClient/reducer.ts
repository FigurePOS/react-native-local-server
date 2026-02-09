import { prepend } from "ramda"
import { Reducer } from "redux"

import { createMessageData } from "../../common/components/messaging/functions"
import { MessageData } from "../../common/components/messaging/types"
import { ClientState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    MESSAGING_CLIENT_DATA_RECEIVED,
    MESSAGING_CLIENT_ERRORED,
    MESSAGING_CLIENT_START_REQUESTED,
    MESSAGING_CLIENT_STATE_CHANGED,
    MESSAGING_CLIENT_STOP_REQUESTED,
} from "./actions"

export type MessagingClientStateObject = {
    state: ClientState
    host: Maybe<string>
    port: Maybe<string>
    error: Maybe<string>
    data: MessageData[]
}

export const createDefaultState = (): MessagingClientStateObject => ({
    state: ClientState.StandBy,
    host: "localhost",
    port: "12000",
    error: null,
    data: [],
})

export const MessagingClientReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: MessagingClientStateObject = createDefaultState(),
    action: StateAction,
): MessagingClientStateObject => {
    switch (action.type) {
        case MESSAGING_CLIENT_START_REQUESTED:
            return {
                ...state,
                state: ClientState.Starting,
            }
        case MESSAGING_CLIENT_STOP_REQUESTED:
            return {
                ...state,
                state: ClientState.ShuttingDown,
            }
        case MESSAGING_CLIENT_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
                data: prepend(createMessageData("status", action.payload.state), state.data),
            }
        case MESSAGING_CLIENT_ERRORED:
            return {
                ...state,
                state: ClientState.Error,
                error: action.payload.error,
            }
        case MESSAGING_CLIENT_DATA_RECEIVED:
            return {
                ...state,
                data: prepend(action.payload.data, state.data),
            }
        default:
            return state
    }
}
