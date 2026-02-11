import { MessageData } from "../../common/components/messaging/types"
import { ServerConnection, ServerState } from "../../common/types"
import { StateObject } from "../../rootReducer"
import { Maybe } from "../../types"

import { TCPServerStateObject } from "./reducer"

export const getBareTCPServerStateObject = (state: StateObject): TCPServerStateObject => state.TCPServer

export const getBareTCPServerPort = (state: StateObject): Maybe<string> => getBareTCPServerStateObject(state).port

export const getBareTCPServerState = (state: StateObject): ServerState => getBareTCPServerStateObject(state).state

export const getBareTCPServerError = (state: StateObject): Maybe<string> => getBareTCPServerStateObject(state).error

export const getBareTCPServerStateLabel = (state: StateObject): string => {
    const serverState = getBareTCPServerState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getBareTCPServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isBareTCPServerRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getBareTCPServerState(state))

export const getBareTCPServerConnections = (state: StateObject): ServerConnection[] =>
    getBareTCPServerStateObject(state).connections.map((c) => ({
        id: c.connectionId,
        state: c.state,
    }))

export const getBareTCPServerActiveConnectionId = (state: StateObject): Maybe<string> =>
    getBareTCPServerStateObject(state).activeConnectionId

export const getBareTCPServerActiveConnection = (state: StateObject): Maybe<ServerConnection> =>
    getBareTCPServerConnections(state).find((c) => c.id === getBareTCPServerActiveConnectionId(state))

export const getBareTCPServerActiveConnectionData = (state: StateObject): Maybe<MessageData[]> =>
    getBareTCPServerStateObject(state).connections.find(
        (c) => c.connectionId === getBareTCPServerActiveConnectionId(state),
    )?.data
