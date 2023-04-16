import { StateObject } from "../../rootReducer"
import { ServerState } from "../../common/types"
import { getBareTCPServerState } from "../TCPServer/selectors"

export const getServiceBrowserStateObject = (state: StateObject) => state.ServiceBrowser

export const getServiceBrowserServices = (state: StateObject): string[] => getServiceBrowserStateObject(state).services

export const getServiceBrowserGroup = (state: StateObject) => getServiceBrowserStateObject(state).group

export const getServiceBrowserState = (state: StateObject) => getServiceBrowserStateObject(state).state

export const getServiceBrowserError = (state: StateObject) => getServiceBrowserStateObject(state).error

export const getServiceBrowserStateLabel = (state: StateObject): string => {
    const serverState = getServiceBrowserState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getServiceBrowserError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isServiceBrowserRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getBareTCPServerState(state))
