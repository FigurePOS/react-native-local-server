import { MessagingClientStateObject } from "./reducer"
import { StateObject } from "../../rootReducer"
import { ClientState } from "../../common/types"
import { Maybe } from "../../types"
import { MessageData } from "../../common/components/messaging/types"

export const getMessagingClientStateObject = (state: StateObject): MessagingClientStateObject => state.MessagingClient

export const getMessagingClientState = (state: StateObject): ClientState => getMessagingClientStateObject(state).state

export const getMessagingClientError = (state: StateObject): Maybe<string> => getMessagingClientStateObject(state).error

export const getMessagingClientStateLabel = (state: StateObject): string => {
    const serverState = getMessagingClientState(state)
    if (serverState !== ClientState.Error) {
        return serverState
    }
    const error = getMessagingClientError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const getMessagingClientHost = (state: StateObject): Maybe<string> => getMessagingClientStateObject(state).host

export const getMessagingClientPort = (state: StateObject): Maybe<string> => getMessagingClientStateObject(state).port

export const getMessagingClientData = (state: StateObject): MessageData[] => getMessagingClientStateObject(state).data

export const isMessagingClientRunning = (state: StateObject): boolean =>
    [ClientState.Ready, ClientState.Starting].includes(getMessagingClientState(state))
