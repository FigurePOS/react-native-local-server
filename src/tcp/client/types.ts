export type TCPClientConfiguration = {
    host: string
    port: number
}

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
}

export interface TCPClientInterface {
    getId: () => string

    getConfiguration: () => TCPClientConfiguration | null

    start: (config: TCPClientConfiguration) => Promise<void>

    sendData: (data: string) => Promise<void>

    stop: () => Promise<void>
}
