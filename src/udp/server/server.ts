import { NativeEventEmitter } from "react-native"
import { Logger } from "../../utils/types"
import { UDPServerModule } from "./module"
import { UDPServerEventName } from "./nativeEvents"
import { UDPServerConfiguration } from "./types"

const eventEmitter = new NativeEventEmitter(UDPServerModule)

export class UDPServer {
    private readonly id: string
    static readonly EventName = UDPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: Logger | null = null
    private config: UDPServerConfiguration | null = null

    constructor(id: string) {
        this.id = id
    }

    getId = (): string => {
        return this.id
    }

    setLogger = (logger: Logger | null) => {
        this.logger = logger
    }

    getConfiguration = (): UDPServerConfiguration | null => {
        return this.config
    }

    start = async (configuration: UDPServerConfiguration): Promise<void> => {
        this.logger?.log(`UDPServer [${this.getId()}] - start`, configuration)
        this.config = configuration
        try {
            await UDPServerModule.createServer(this.getId(), this.config.port)
            this.logger?.log(`UDPServer [${this.getId()}] - start - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`UDPServer [${this.getId()}] - start - error`, e)
            return Promise.reject(e)
        }
    }

    sendData = async (host: string, port: number, data: string): Promise<void> => {
        this.logger?.log(`UDPServer [${this.getId()}] - sendData`, { host: host, port: port, data: data })
        try {
            await UDPServerModule.send(this.getId(), host, port, data)
            this.logger?.log(`UDPServer [${this.getId()}] - sendData - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`UDPServer [${this.getId()}] - sendData - error`, e)
            return Promise.reject(e)
        }
    }

    // TODO stop reason as in TCP
    stop = async (): Promise<void> => {
        this.logger?.log(`UDPServer [${this.getId()}] - stop`)
        try {
            await UDPServerModule.stopServer(this.getId())
            this.logger?.log(`UDPServer [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`UDPServer [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
