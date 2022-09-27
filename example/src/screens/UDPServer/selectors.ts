import { StateObject } from "../../rootReducer"
import { UDPServerStateObject } from "./reducer"
import { Maybe } from "../../types"
import { ServerState } from "../../common/types"
import { MessageData } from "../../common/components/messaging/types"

export const getBareUDPServerStateObject = (state: StateObject): UDPServerStateObject => state.UDPServer

export const getBareUDPServerPort = (state: StateObject): Maybe<string> => getBareUDPServerStateObject(state).port

export const getBareUDPServerState = (state: StateObject): ServerState => getBareUDPServerStateObject(state).state

export const getBareUDPServerError = (state: StateObject): Maybe<string> => getBareUDPServerStateObject(state).error

export const getBareUDPServerStateLabel = (state: StateObject): string => {
    const serverState = getBareUDPServerState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getBareUDPServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isBareUDPServerRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getBareUDPServerState(state))

export const getBareUDPServerData = (state: StateObject): MessageData[] => getBareUDPServerStateObject(state).data
