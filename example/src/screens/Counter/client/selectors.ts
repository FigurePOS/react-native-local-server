import { CounterClientStateObject } from "./reducer"
import { StateObject } from "../../../rootReducer"
import { ClientState } from "../../../common/types"
import { Maybe } from "../../../types"

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
