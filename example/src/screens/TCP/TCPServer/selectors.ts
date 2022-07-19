import { TCPServerState } from "../common/types"
import { StateObject } from "../../../rootReducer"
import { TCPServerConnectionStateObject, TCPServerStateObject } from "./reducer"
import { Maybe } from "../../../types"

export const getBareTCPServerStateObject = (state: StateObject): TCPServerStateObject => state.TCPServer

export const getBareTCPServerPort = (state: StateObject): Maybe<string> => getBareTCPServerStateObject(state).port

export const getBareTCPServerState = (state: StateObject): TCPServerState => getBareTCPServerStateObject(state).state

export const getBareTCPServerError = (state: StateObject): Maybe<string> => getBareTCPServerStateObject(state).error

export const getBareTCPServerStateLabel = (state: StateObject): string => {
    const serverState = getBareTCPServerState(state)
    if (serverState !== TCPServerState.Error) {
        return serverState
    }
    const error = getBareTCPServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isBareTCPServerRunning = (state: StateObject): boolean =>
    [TCPServerState.Ready, TCPServerState.Starting].includes(getBareTCPServerState(state))

export const getBareTCPServerConnections = (state: StateObject): TCPServerConnectionStateObject[] =>
    getBareTCPServerStateObject(state).connections

export const getBareTCPServerActiveConnectionId = (state: StateObject): Maybe<string> =>
    getBareTCPServerStateObject(state).activeConnectionId

export const getBareTCPServerActiveConnection = (state: StateObject): Maybe<TCPServerConnectionStateObject> =>
    getBareTCPServerConnections(state).find((c) => c.connectionId === getBareTCPServerActiveConnectionId(state))
