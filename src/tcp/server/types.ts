export type TCPServerConfiguration = {
    port: number
}

export interface TCPServerInterface {
    getId: () => string

    getConfiguration: () => TCPServerConfiguration | null

    start: (config: TCPServerConfiguration) => Promise<void>

    sendData: (connectionId: string, data: string) => Promise<void>

    stop: () => Promise<void>
}
