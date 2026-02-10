import { ServerConnection, ServerConnectionState, ServerState } from "../../../common/types"
import { StateObject } from "../../../rootReducer"
import { Maybe } from "../../../types"

import { CounterServerStateObject } from "./reducer"

export const getCounterServerStateObject = (state: StateObject): CounterServerStateObject => state.Counter.server

export const getCounterServerState = (state: StateObject): ServerState => getCounterServerStateObject(state).state

export const isCounterServerRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getCounterServerState(state))

export const getCounterServerError = (state: StateObject): Maybe<string> => getCounterServerStateObject(state).error

export const getCounterServerStateLabel = (state: StateObject): string => {
    const serverState = getCounterServerState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getCounterServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const getCounterServerPort = (state: StateObject): Maybe<string> => getCounterServerStateObject(state).port

export const getCounterServerConnections = (state: StateObject): ServerConnection[] =>
    getCounterServerStateObject(state).connections

export const getCounterServerReadyConnections = (state: StateObject): ServerConnection[] =>
    getCounterServerStateObject(state).connections.filter((c) => c.state === ServerConnectionState.Ready)

export const getCounterServerIpAddress = (state: StateObject): Maybe<string> =>
    getCounterServerStateObject(state).ipAddress
