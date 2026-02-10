import { MessagingClientServiceSearchResult } from "@figuredev/react-native-local-server"

import { ClientState } from "../../../common/types"
import { StateObject } from "../../../rootReducer"
import { Maybe } from "../../../types"

import { CounterClientStateObject } from "./reducer"

export const getCounterClientStateObject = (state: StateObject): CounterClientStateObject => state.Counter.client

export const getCounterClientState = (state: StateObject): ClientState => getCounterClientStateObject(state).state

export const getCounterClientError = (state: StateObject): Maybe<string> => getCounterClientStateObject(state).error

export const getCounterClientStateLabel = (state: StateObject): string => {
    const serverState = getCounterClientState(state)
    if (serverState !== ClientState.Error) {
        return serverState
    }
    const error = getCounterClientError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const getCounterClientHost = (state: StateObject): Maybe<string> => getCounterClientStateObject(state).host

export const getCounterClientPort = (state: StateObject): Maybe<string> => getCounterClientStateObject(state).port

export const isCounterClientRunning = (state: StateObject): boolean =>
    [ClientState.Ready, ClientState.Starting].includes(getCounterClientState(state))

export const getCounterClientSearchState = (state: StateObject): ClientState =>
    getCounterClientStateObject(state).searchState

export const getCounterClientSearchError = (state: StateObject): Maybe<string> =>
    getCounterClientStateObject(state).searchError

export const getCounterClientSearchStateLabel = (state: StateObject): string => {
    const serverState = getCounterClientSearchState(state)
    if (serverState !== ClientState.Error) {
        return serverState
    }
    const error = getCounterClientSearchError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const getCounterClientAvailableServices = (state: StateObject): MessagingClientServiceSearchResult[] =>
    getCounterClientStateObject(state).availableServices
