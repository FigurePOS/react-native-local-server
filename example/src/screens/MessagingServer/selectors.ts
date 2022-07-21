import { MessagingServerStateObject } from "./reducer"
import { StateObject } from "../../rootReducer"
import { ServerConnection, ServerState } from "../../common/types"
import { Maybe } from "../../types"
import { MessageData } from "../../common/components/messaging/types"

export const getMessagingServerStateObject = (state: StateObject): MessagingServerStateObject => state.MessagingServer

export const getMessagingServerState = (state: StateObject): ServerState => getMessagingServerStateObject(state).state

export const isMessagingServerRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getMessagingServerState(state))

export const getMessagingServerError = (state: StateObject): Maybe<string> => getMessagingServerStateObject(state).error

export const getMessagingServerStateLabel = (state: StateObject): string => {
    const serverState = getMessagingServerState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getMessagingServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const getMessagingServerPort = (state: StateObject): Maybe<string> => getMessagingServerStateObject(state).port

export const getMessagingServerConnections = (state: StateObject): ServerConnection[] =>
    getMessagingServerStateObject(state).connections

export const getMessagingServerActiveConnectionId = (state: StateObject): Maybe<string> =>
    getMessagingServerStateObject(state).activeConnectionId

export const getMessagingServerActiveConnectionData = (state: StateObject): Maybe<MessageData[]> => {
    const activeId = getMessagingServerActiveConnectionId(state)
    return activeId ? getMessagingServerStateObject(state).connectionData[activeId] : null
}
