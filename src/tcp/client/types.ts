export type TCPClientConfiguration = {
    id: string
    host: string
    port: number
}

export enum TCPClientEventName {
    Ready = "TCP_Client_Ready",
    Stopped = "TCP_Client_Stopped",
    MessageReceived = "TCP_Client_MessageReceived",
}

export interface TCPClientInterface {
    getConfiguration: () => TCPClientConfiguration

    start: () => Promise<void>

    stop: () => Promise<void>

    sendMessage: (message: string) => Promise<void>
}
