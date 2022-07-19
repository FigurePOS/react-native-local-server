import { TCPClientState, TCPData } from "../common/types"
import { StateObject } from "../../../rootReducer"
import { TCPClientStateObject } from "./reducer"
import { Maybe } from "../../../types"

export const getBareTCPClientStateObject = (state: StateObject): TCPClientStateObject => state.TCPClient

export const getBareTCPClientPort = (state: StateObject): Maybe<string> => getBareTCPClientStateObject(state).port

export const getBareTCPClientHost = (state: StateObject): Maybe<string> => getBareTCPClientStateObject(state).host

export const getBareTCPClientState = (state: StateObject): TCPClientState => getBareTCPClientStateObject(state).state

export const getBareTCPClientError = (state: StateObject): Maybe<string> => getBareTCPClientStateObject(state).error

export const getBareTCPClientStateLabel = (state: StateObject): string => {
    const serverState = getBareTCPClientState(state)
    if (serverState !== TCPClientState.Error) {
        return serverState
    }
    const error = getBareTCPClientError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isBareTCPClientRunning = (state: StateObject): boolean =>
    [TCPClientState.Ready, TCPClientState.Starting].includes(getBareTCPClientState(state))

export const getBareTCPClientData = (state: StateObject): TCPData[] => getBareTCPClientStateObject(state).data
