import { PhoneCall } from "@figuredev/react-native-local-server"

import { ServerState } from "../../common/types"
import { StateObject } from "../../rootReducer"
import { Maybe } from "../../types"

import { CallerIDServerStateObject } from "./reducer"

export const getCallerIDServerStateObject = (state: StateObject): CallerIDServerStateObject => state.CallerID

export const getCallerIDServerState = (state: StateObject): ServerState => getCallerIDServerStateObject(state).state

export const getCallerIDServerError = (state: StateObject): Maybe<string> => getCallerIDServerStateObject(state).error

export const getCallerIDServerStateLabel = (state: StateObject): string => {
    const serverState = getCallerIDServerState(state)
    if (serverState !== ServerState.Error) {
        return serverState
    }
    const error = getCallerIDServerError(state) ?? "unknown error"
    return `${serverState} (${error})`
}

export const isCallerIDServerRunning = (state: StateObject): boolean =>
    [ServerState.Ready, ServerState.Starting].includes(getCallerIDServerState(state))

export const getCallerIDIncomingCalls = (state: StateObject): PhoneCall[] =>
    getCallerIDServerStateObject(state).incomingCalls
