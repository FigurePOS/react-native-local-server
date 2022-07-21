import { Logger } from "../../utils/types"

export type TCPServerConfiguration = {
    port: number
}

export interface TCPServerInterface {
    getId: () => string

    getConfiguration: () => TCPServerConfiguration | null

    setLogger: (logger: Logger | null) => void

    start: (config: TCPServerConfiguration) => Promise<void>

    sendData: (connectionId: string, data: string) => Promise<void>

    closeConnection: (connectionId: string) => Promise<void>

    stop: () => Promise<void>
}
