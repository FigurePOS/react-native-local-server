import { Maybe, StateAction } from "../../types"
import { Reducer } from "redux"
import { MessageData } from "../../common/components/messaging/types"
import { ServerConnection, ServerConnectionState, ServerState } from "../../common/types"
import {
    MESSAGING_SERVER_ACTIVE_CONNECTION_CHANGED,
    MESSAGING_SERVER_CONNECTION_STATE_CHANGED,
    MESSAGING_SERVER_DATA_RECEIVED,
    MESSAGING_SERVER_ERRORED,
    MESSAGING_SERVER_START_REQUESTED,
    MESSAGING_SERVER_STATE_CHANGED,
    MESSAGING_SERVER_STOP_REQUESTED,
} from "./actions"
import { append, map, none, prepend } from "ramda"
import { createMessageData } from "../../common/components/messaging/functions"

export type MessagingServerStateObject = {
    state: ServerState
    port: Maybe<string>
    error: Maybe<string>
    connections: ServerConnection[]
    connectionData: Record<string, MessageData[]>
    activeConnectionId: Maybe<string>
}

export const createDefaultState = (): MessagingServerStateObject => ({
    state: ServerState.StandBy,
    port: "12000",
    error: null,
    connections: [],
    connectionData: {},
    activeConnectionId: null,
})

export const MessagingServerReducer: Reducer = (
    state: MessagingServerStateObject = createDefaultState(),
    action: StateAction
): MessagingServerStateObject => {
    switch (action.type) {
        case MESSAGING_SERVER_START_REQUESTED:
            return {
                ...state,
                state: ServerState.Starting,
            }

        case MESSAGING_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }

        case MESSAGING_SERVER_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
            }

        case MESSAGING_SERVER_ERRORED:
            return {
                ...state,
                state: ServerState.Error,
                error: action.payload.error,
            }

        case MESSAGING_SERVER_ACTIVE_CONNECTION_CHANGED:
            return {
                ...state,
                activeConnectionId: action.payload.connectionId,
            }

        case MESSAGING_SERVER_CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connections: updateConnectionState(
                    state.connections,
                    action.payload.connectionId,
                    action.payload.state
                ),
                connectionData: updateConnectionData(
                    state.connectionData,
                    action.payload.connectionId,
                    createMessageData("status", action.payload.state)
                ),
            }

        case MESSAGING_SERVER_DATA_RECEIVED:
            return {
                ...state,
                connectionData: updateConnectionData(
                    state.connectionData,
                    action.payload.connectionId,
                    action.payload.data
                ),
            }

        default:
            return state
    }
}

export const updateConnectionState = (
    connections: ServerConnection[],
    connectionId: string,
    state: ServerConnectionState
): ServerConnection[] => {
    if (none((connection) => connection.id === connectionId, connections)) {
        const newConnection: ServerConnection = {
            id: connectionId,
            state: state,
        }
        return append(newConnection, connections)
    }
    return map((connection) => {
        if (connection.id === connectionId) {
            return {
                ...connection,
                state: state,
            }
        }
        return connection
    }, connections)
}

export const updateConnectionData = (
    data: Record<string, MessageData[]>,
    connectionId: string,
    newData: MessageData
): Record<string, MessageData[]> => ({
    ...data,
    [connectionId]: prepend(newData, data[connectionId] ?? []),
})
