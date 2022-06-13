export type LocalMessagingClientConfiguration = {
    id: string
    host: string
    port: number
}

export enum LocalMessagingClientEventName {
    ClientReady = "ClientReady",
    ClientStopped = "ClientStopped",
    ClientReceivedMessage = "ClientReceivedMessage",
}

export interface LocalMessagingClientInterface {
    getConfiguration: () => LocalMessagingClientConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (message: string) => Promise<void>
}
