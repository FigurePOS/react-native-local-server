export type TCPClientConfiguration = {
    host: string
    port: number
}

export interface TCPClientInterface {
    getId: () => string

    getConfiguration: () => TCPClientConfiguration | null

    start: (config: TCPClientConfiguration) => Promise<void>

    sendData: (data: string) => Promise<void>

    stop: () => Promise<void>
}
