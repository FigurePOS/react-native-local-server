export type TCPClientConfiguration = {
    id: string
    host: string
    port: number
}

export enum TCPClientEventName {
    ClientReady = "ClientReady",
    ClientStopped = "ClientStopped",
    ClientReceivedMessage = "ClientReceivedMessage",
}

export interface TCPClientInterface {
    getConfiguration: () => TCPClientConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (message: string) => Promise<void>
}
