export type TCPServerConfiguration = {
    id: string
    port: number
}

export enum TCPServerEventName {
    Ready = "TCP_Server_Ready",
    Stopped = "TCP_Server_Stopped",
    ConnectionAccepted = "TCP_Server_ConnectionAccepted",
    ConnectionReady = "TCP_Server_ConnectionReady",
    ConnectionLost = "TCP_Server_ConnectionLost",
    ConnectionClosed = "TCP_Server_ConnectionClosed",
    DataReceived = "TCP_Server_DataReceived",
}

export interface TCPServerInterface {
    getConfiguration: () => TCPServerConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendData: (connectionId: string, message: string) => Promise<void>

    // TODO we should remove this since TCP doesn't support broadcasting and this is just fake
    broadcastMessage: (message: string) => Promise<void>
}
