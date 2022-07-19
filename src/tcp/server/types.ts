export type TCPServerConfiguration = {
    port: number
}

export enum TCPServerEventName {
    Ready = "RN_Local_Communication__TCP_Server_Ready",
    Stopped = "RN_Local_Communication__TCP_Server_Stopped",
    ConnectionAccepted = "RN_Local_Communication__TCP_Server_ConnectionAccepted",
    ConnectionReady = "RN_Local_Communication__TCP_Server_ConnectionReady",
    ConnectionClosed = "RN_Local_Communication__TCP_Server_ConnectionClosed",
    DataReceived = "RN_Local_Communication__TCP_Server_DataReceived",
}

export interface TCPServerInterface {
    getId: () => string

    getConfiguration: () => TCPServerConfiguration | null

    start: (config: TCPServerConfiguration) => Promise<void>

    sendData: (connectionId: string, data: string) => Promise<void>

    stop: () => Promise<void>
}
