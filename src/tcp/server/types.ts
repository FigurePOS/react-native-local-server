export type TCPServerConfiguration = {
    id: string
    port: number
}

export enum TCPServerEventName {
    Ready = "RN_Local_Communication__TCP_Server_Ready",
    Stopped = "RN_Local_Communication__TCP_Server_Stopped",
    ConnectionAccepted = "RN_Local_Communication__TCP_Server_ConnectionAccepted",
    ConnectionReady = "RN_Local_Communication__TCP_Server_ConnectionReady",
    ConnectionLost = "RN_Local_Communication__TCP_Server_ConnectionLost",
    ConnectionClosed = "RN_Local_Communication__TCP_Server_ConnectionClosed",
    DataReceived = "RN_Local_Communication__TCP_Server_DataReceived",
}

export interface TCPServerInterface {
    getConfiguration: () => TCPServerConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendData: (connectionId: string, message: string) => Promise<void>

    // TODO we should remove this since TCP doesn't support broadcasting and this is just fake
    broadcastMessage: (message: string) => Promise<void>
}
