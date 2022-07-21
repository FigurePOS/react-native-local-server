import type { TCPClientConfiguration, TCPClientInterface } from "./types"
import { TCPClientModule } from "./module"
import { NativeEventEmitter } from "react-native"
import { TCPClientEventName } from "./nativeEvents"
import { Logger } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"

const eventEmitter = new NativeEventEmitter(TCPClientModule)

export class TCPClient implements TCPClientInterface {
    private readonly id: string
    static readonly EventName = TCPClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: Logger | null = DefaultLogger
    private config: TCPClientConfiguration | null = null

    constructor(id: string) {
        this.id = id
    }

    getId = (): string => {
        return this.id
    }

    getConfiguration = (): TCPClientConfiguration | null => {
        return this.config
    }

    setLogger = (logger: Logger | null) => {
        this.logger = logger
    }

    start = async (config: TCPClientConfiguration): Promise<void> => {
        this.logger?.log(`TCPClient [${this.getId()}] - start`, config)
        try {
            this.config = config
            await TCPClientModule.createClient(this.getId(), this.config.host, this.config.port)
            this.logger?.log(`TCPClient [${this.getId()}] - start - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPClient [${this.getId()}] - start - error`, e)
            return Promise.reject(e)
        }
    }

    sendData = async (data: string): Promise<void> => {
        this.logger?.log(`TCPClient [${this.getId()}] - sendData`, { data: data })
        try {
            await TCPClientModule.send(this.getId(), data)
            this.logger?.log(`TCPClient [${this.getId()}] - sendData - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPClient [${this.getId()}] - sendData - error`, e)
            return Promise.reject(e)
        }
    }

    stop = async (): Promise<void> => {
        this.logger?.log(`TCPClient [${this.getId()}] - stop`)
        try {
            await TCPClientModule.stopClient(this.getId())
            this.logger?.log(`TCPClient [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPClient [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
