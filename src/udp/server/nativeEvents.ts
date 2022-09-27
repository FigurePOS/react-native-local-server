import { StopReason } from "../../utils/types"

export enum UDPServerEventName {
    Ready = "RN_Local_Communication__UDP_Server_Ready",
    Stopped = "RN_Local_Communication__UDP_Server_Stopped",
    DataReceived = "RN_Local_Communication__UDP_Server_DataReceived",
}

export type UDPServerReadyNativeEvent = {
    type: UDPServerEventName.Ready
    serverId: string
}

export type UDPServerStoppedNativeEvent = {
    type: UDPServerEventName.Stopped
    serverId: string
    reason?: StopReason
}

export type UDPServerDataReceivedNativeEvent = {
    type: UDPServerEventName.DataReceived
    serverId: string
    connectionId: string
    data: string
}

export type UDPServerNativeEvent =
    | UDPServerReadyNativeEvent
    | UDPServerStoppedNativeEvent
    | UDPServerDataReceivedNativeEvent
