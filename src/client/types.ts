export type LocalMessagingClientConfiguration = {
    id: string
    host: string
    port: number
}

export interface LocalMessagingClientInterface {
    getConfiguration: () => LocalMessagingClientConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (message: string) => Promise<void>
}
