import { Maybe, StateAction } from "../../types"
import { Reducer } from "redux"
import { TCPServerConnectionData, TCPServerConnectionState, TCPServerState } from "./types"
import {
    BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED,
    BARE_TCP_SERVER_CONNECTION_NEW_DATA,
    BARE_TCP_SERVER_CONNECTION_STATE_CHANGED,
    BARE_TCP_SERVER_READY,
    BARE_TCP_SERVER_START_ERRORED,
    BARE_TCP_SERVER_START_FAILED,
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
    BARE_TCP_SERVER_STOPPED,
} from "./actions"
import { append, map, none, prepend } from "ramda"

export type TCPServerStateObject = {
    state: TCPServerState
    port: Maybe<string>
    error: Maybe<string>
    connections: TCPServerConnectionStateObject[]
    activeConnectionId: Maybe<string>
}

export type TCPServerConnectionStateObject = {
    connectionId: string
    state: TCPServerConnectionState
    data: TCPServerConnectionData[]
}

export const createDefaultDevicesState = (): TCPServerStateObject => ({
    state: TCPServerState.StandBy,
    port: "12000",
    error: null,
    connections: [],
    activeConnectionId: null,
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
        case BARE_TCP_SERVER_CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connections: updateConnectionState(
                    state.connections,
                    action.payload.connectionId,
                    action.payload.state
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
    state: TCPServerConnectionState
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
    data: TCPServerConnectionData
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
