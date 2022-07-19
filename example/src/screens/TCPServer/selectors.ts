import { TCPServerState } from "./types"
import { StateObject } from "../../rootReducer"
import { TCPServerStateObject } from "./reducer"
import { Maybe } from "../../types"

export const getBareTCPServerStateObject = (state: StateObject): TCPServerStateObject => state.TCPServer

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
