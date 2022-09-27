import { StopReason } from "../../utils/types"

export enum TCPClientEventName {
    Ready = "RN_Local_Communication__TCP_Client_Ready",
    Stopped = "RN_Local_Communication__TCP_Client_Stopped",
    DataReceived = "RN_Local_Communication__TCP_Client_DataReceived",
}

export type TCPClientDataReceivedNativeEvent = {
    type: TCPClientEventName.DataReceived
    clientId: string
    data: string
}

export type TCPClientReadyNativeEvent = {
    type: TCPClientEventName.Ready
    clientId: string
}

export type TCPClientStoppedNativeEvent = {
    type: TCPClientEventName.Stopped
    clientId: string
    reason?: StopReason
}

export type TCPClientNativeEvent =
    | TCPClientDataReceivedNativeEvent
    | TCPClientReadyNativeEvent
    | TCPClientStoppedNativeEvent
