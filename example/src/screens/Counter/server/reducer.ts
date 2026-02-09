import { append, map, none } from "ramda"
import { Reducer } from "redux"

import { ServerConnection, ServerConnectionState, ServerState } from "../../../common/types"
import { Maybe, StateAction } from "../../../types"

import {
    COUNTER_SERVER_CONNECTION_STATE_CHANGED,
    COUNTER_SERVER_ERRORED,
    COUNTER_SERVER_IP_ADDRESS_CHANGED,
    COUNTER_SERVER_START_REQUESTED,
    COUNTER_SERVER_STATE_CHANGED,
    COUNTER_SERVER_STOP_REQUESTED,
} from "./actions"

export type CounterServerStateObject = {
    state: ServerState
    port: Maybe<string>
    ipAddress: Maybe<string>
    error: Maybe<string>
    connections: ServerConnection[]
}

export const createDefaultState = (): CounterServerStateObject => ({
    state: ServerState.StandBy,
    port: "12000",
    ipAddress: null,
    error: null,
    connections: [],
})

export const counterServerReducer: Reducer = (
    // eslint-disable-next-line @typescript-eslint/default-param-last
    state: CounterServerStateObject = createDefaultState(),
    action: StateAction,
): CounterServerStateObject => {
    switch (action.type) {
        case COUNTER_SERVER_START_REQUESTED:
            return {
                ...state,
                state: ServerState.Starting,
            }

        case COUNTER_SERVER_STOP_REQUESTED:
            return {
                ...state,
                state: ServerState.ShuttingDown,
            }

        case COUNTER_SERVER_STATE_CHANGED:
            return {
                ...state,
                state: action.payload.state,
                port: `${action.payload.port}`,
            }

        case COUNTER_SERVER_ERRORED:
            return {
                ...state,
                state: ServerState.Error,
                error: action.payload.error,
            }

        case COUNTER_SERVER_CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connections: updateConnectionState(
                    state.connections,
                    action.payload.connectionId,
                    action.payload.state,
                ),
            }

        case COUNTER_SERVER_IP_ADDRESS_CHANGED:
            return {
                ...state,
                ipAddress: action.payload.ip,
            }

        default:
            return state
    }
}

export const updateConnectionState = (
    connections: ServerConnection[],
    connectionId: string,
    state: ServerConnectionState,
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
