export type LocalMessagingServerConfiguration = {
    id: string
    port: number
}

export interface LocalMessagingServerInterface {
    getConfiguration: () => LocalMessagingServerConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (connectionId: string, message: string) => Promise<void>

    broadcastMessage: (message: string) => Promise<void>
}
