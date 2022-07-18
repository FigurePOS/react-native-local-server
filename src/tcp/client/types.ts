export type TCPClientConfiguration = {
    id: string
    host: string
    port: number
}

// TODO add project prefix
export enum TCPClientEventName {
    Ready = "TCP_Client_Ready",
    Stopped = "TCP_Client_Stopped",
    DataReceived = "TCP_Client_DataReceived",
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
    getConfiguration: () => TCPClientConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (message: string) => Promise<void>
}
