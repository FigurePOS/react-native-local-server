import type { TCPServerConfiguration } from "./types"
import { TCPServerModule } from "./module"
import { NativeEventEmitter } from "react-native"
import { TCPServerEventName } from "./nativeEvents"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"

const eventEmitter = new NativeEventEmitter(TCPServerModule)

export class TCPServer {
    private readonly id: string
    static readonly EventName = TCPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: Logger | null = DefaultLogger
    private config: TCPServerConfiguration | null = null

    constructor(id: string) {
        this.id = id
    }

    getId = (): string => {
        return this.id
    }

    setLogger = (logger: Logger | null) => {
        this.logger = logger
    }

    getConfiguration = (): TCPServerConfiguration | null => {
        return this.config
    }

    start = async (configuration: TCPServerConfiguration): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - start`, configuration)
        this.config = configuration
        try {
            await TCPServerModule.createServer(this.getId(), this.config.port)
            this.logger?.log(`TCPServer [${this.getId()}] - start - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - start - error`, e)
            return Promise.reject(e)
        }
    }

    sendData = async (connectionId: string, data: string): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - sendData`, { connectionId: connectionId, data: data })
        try {
            await TCPServerModule.send(this.getId(), connectionId, data)
            this.logger?.log(`TCPServer [${this.getId()}] - sendData - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - sendData - error`, e)
            return Promise.reject(e)
        }
    }

    closeConnection = async (connectionId: string): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - closeConnection`, { connectionId: connectionId })
        try {
            await TCPServerModule.closeConnection(this.getId(), connectionId)
            this.logger?.log(`TCPServer [${this.getId()}] - closeConnection - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - closeConnection - error`, e)
            return Promise.reject(e)
        }
    }

    stop = async (): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - stop`)
        try {
            await TCPServerModule.stopServer(this.getId())
            this.logger?.log(`TCPServer [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
