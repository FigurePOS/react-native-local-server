export enum TCPServerEventName {
    Ready = "RN_Local_Communication__TCP_Server_Ready",
    Stopped = "RN_Local_Communication__TCP_Server_Stopped",
    ConnectionAccepted = "RN_Local_Communication__TCP_Server_ConnectionAccepted",
    ConnectionReady = "RN_Local_Communication__TCP_Server_ConnectionReady",
    ConnectionClosed = "RN_Local_Communication__TCP_Server_ConnectionClosed",
    DataReceived = "RN_Local_Communication__TCP_Server_DataReceived",
}

export type TCPServerReadyNativeEvent = {
    type: TCPServerEventName.Ready
    serverId: string
}

export type TCPServerStoppedNativeEvent = {
    type: TCPServerEventName.Stopped
    serverId: string
    error?: string
}

export type TCPServerConnectionAcceptedNativeEvent = {
    type: TCPServerEventName.ConnectionAccepted
    serverId: string
    connectionId: string
}

export type TCPServerConnectionReadyNativeEvent = {
    type: TCPServerEventName.ConnectionReady
    serverId: string
    connectionId: string
}

export type TCPServerConnectionClosedNativeEvent = {
    type: TCPServerEventName.ConnectionClosed
    serverId: string
    connectionId: string
    error?: string
}

export type TCPServerDataReceivedNativeEvent = {
    type: TCPServerEventName.DataReceived
    serverId: string
    connectionId: string
    data: string
}

export type TCPServerNativeEvent =
    | TCPServerReadyNativeEvent
    | TCPServerStoppedNativeEvent
    | TCPServerConnectionReadyNativeEvent
    | TCPServerConnectionClosedNativeEvent
    | TCPServerDataReceivedNativeEvent
