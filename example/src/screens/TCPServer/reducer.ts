import { append, map, none, prepend } from "ramda"
import { Reducer } from "redux"

import { MessageData } from "../../common/components/messaging/types"
import { ServerConnectionState, ServerState } from "../../common/types"
import { Maybe, StateAction } from "../../types"

import {
    BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED,
    BARE_TCP_SERVER_CONNECTION_NEW_DATA,
    BARE_TCP_SERVER_CONNECTION_STATE_CHANGED,
    BARE_TCP_SERVER_ERRORED,
    BARE_TCP_SERVER_READY,
    BARE_TCP_SERVER_START_FAILED,
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
    BARE_TCP_SERVER_STOPPED,
} from "./actions"

export type TCPServerStateObject = {
    state: ServerState
    port: Maybe<string>
    error: Maybe<string>
    connections: TCPServerConnectionStateObject[]
    activeConnectionId: Maybe<string>
}

export type TCPServerConnectionStateObject = {
    connectionId: string
    state: ServerConnectionState
    data: MessageData[]
}

export const createDefaultState = (): TCPServerStateObject => ({
    state: ServerState.StandBy,
    port: "",
    error: null,
    connections: [],
    activeConnectionId: null,
})

export const TCPServerReducer: Reducer = (
    state: TCPServerStateObject = createDefaultState(),
    action: StateAction,
): TCPServerStateObject => {
    switch (action.type) {
        case BARE_TCP_SERVER_START_REQUESTED:
            return {
                ...state,
                port: action.payload.port,
                state: ServerState.Starting,
            }
        case BARE_TCP_SERVER_ERRORED:
        case BARE_TCP_SERVER_START_FAILED:
            return {
                ...state,
                error: action.payload.error,
                state: ServerState.Error,
            }
        case BARE_TCP_SERVER_READY:
            return {
                ...state,
                state: ServerState.Ready,
                port: `${action.payload.port}`,
            }
        case BARE_TCP_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }
        case BARE_TCP_SERVER_STOPPED:
            return {
                ...state,
                state: action.payload.error ? ServerState.Error : ServerState.StandBy,
                error: action.payload.error,
            }
        case BARE_TCP_SERVER_CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connections: updateConnectionState(
                    state.connections,
                    action.payload.connectionId,
                    action.payload.state,
                ),
            }
        case BARE_TCP_SERVER_CONNECTION_NEW_DATA:
            return {
                ...state,
                connections: updateConnectionData(state.connections, action.payload.connectionId, action.payload.data),
            }
        case BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED:
            return {
                ...state,
                activeConnectionId: action.payload.connectionId,
            }
        default:
            return state
    }
}

export const updateConnectionState = (
    connections: TCPServerConnectionStateObject[],
    connectionId: string,
    state: ServerConnectionState,
): TCPServerConnectionStateObject[] => {
    if (none((connection) => connection.connectionId === connectionId, connections)) {
        const newConnection: TCPServerConnectionStateObject = {
            connectionId: connectionId,
            state: state,
            data: [],
        }
        return append(newConnection, connections)
    }
    return map((connection) => {
        if (connection.connectionId === connectionId) {
            return {
                ...connection,
                state: state,
            }
        }
        return connection
    }, connections)
}

export const updateConnectionData = (
    connections: TCPServerConnectionStateObject[],
    connectionId: string,
    data: MessageData,
): TCPServerConnectionStateObject[] =>
    map((connection) => {
        if (connection.connectionId === connectionId) {
            return {
                ...connection,
                data: prepend(data, connection.data),
            }
        }
        return connection
    }, connections)
