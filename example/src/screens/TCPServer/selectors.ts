import { TCPServerState } from "./types"
import { StateObject } from "../../rootReducer"
import { TCPServerStateObject } from "./reducer"

export const getTCPServerStateObject = (state: StateObject): TCPServerStateObject => state.TCPServer

export const getTCPServerState = (state: StateObject): TCPServerState => getTCPServerStateObject(state).state

export const isTCPServerRunning = (state: StateObject): boolean =>
    [TCPServerState.Ready, TCPServerState.Starting].includes(getTCPServerState(state))
