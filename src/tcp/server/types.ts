export type TCPServerConfiguration = {
    id: string
    port: number
}

export enum TCPServerEventName {
    ServerReady = "ServerReady",
    ServerStopped = "ServerStopped",
    ServerConnectionAccepted = "ServerConnectionAccepted",
    ServerConnectionReady = "ServerConnectionReady",
    ServerConnectionLost = "ServerConnectionLost",
    ServerConnectionClosed = "ServerConnectionClosed",
    ServerReceivedMessage = "ServerReceivedMessage",
}

export interface TCPServerInterface {
    getConfiguration: () => TCPServerConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (connectionId: string, message: string) => Promise<void>

    // TODO we should remove this since TCP doesn't support broadcasting and this is just fake
    broadcastMessage: (message: string) => Promise<void>
}
