export type LocalMessagingServerConfiguration = {
    id: string
    port: number
}

export enum LocalMessagingServerEventName {
    ServerReady = "ServerReady",
    ServerStopped = "ServerStopped",
    ServerConnectionAccepted = "ServerConnectionAccepted",
    ServerConnectionReady = "ServerConnectionReady",
    ServerConnectionLost = "ServerConnectionLost",
    ServerConnectionClosed = "ServerConnectionClosed",
    ServerReceivedMessage = "ServerReceivedMessage",
}

export interface LocalMessagingServerInterface {
    getConfiguration: () => LocalMessagingServerConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (connectionId: string, message: string) => Promise<void>

    broadcastMessage: (message: string) => Promise<void>
}
