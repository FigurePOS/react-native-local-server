import type { TCPClientConfiguration } from "./types"
import { TCPClientModule } from "./module"
import { NativeEventEmitter } from "react-native"
import { TCPClientEventName } from "./nativeEvents"
import { Logger, StopReason, StopReasonEnum } from "../../utils/types"

const eventEmitter = new NativeEventEmitter(TCPClientModule)

/**
 * Implementation of TCP protocol (client)
 */
export class TCPClient {
    private readonly id: string
    static readonly EventName = TCPClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: Logger | null = null
    private configuration: TCPClientConfiguration | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two clients with the same id at the same time
     */
    constructor(id: string) {
        this.id = id
    }

    /**
     * Returns id of the client.
     */
    getId = (): string => {
        return this.id
    }

    /**
     * This method sets logger.
     * @param logger - logger object to be used when logging
     */
    setLogger = (logger: Logger | null) => {
        this.logger = logger
    }

    /**
     * This method returns last configuration of the client.
     */
    getConfiguration = (): TCPClientConfiguration | null => {
        return this.configuration
    }

    /**
     * This method starts the client.
     * Once the TCPClientReadyNativeEvent event is emitted the client is ready to send and receive data.
     * @param configuration - configuration of the client
     */
    start = async (configuration: TCPClientConfiguration): Promise<void> => {
        this.logger?.log(`TCPClient [${this.getId()}] - start`, configuration)
        try {
            this.configuration = configuration
            await TCPClientModule.createClient(this.getId(), this.configuration.host, this.configuration.port)
            this.logger?.log(`TCPClient [${this.getId()}] - start - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPClient [${this.getId()}] - start - error`, e)
            return Promise.reject(e)
        }
    }

    /**
     * This method sends data to the server.
     * @param data - data to be sent
     */
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

    /**
     * This method stops the client.
     * @param reason - internal reason for stopping the client (it will be reported in TCPClientStoppedNativeEvent)     */
    stop = async (reason?: StopReason): Promise<void> => {
        this.logger?.log(`TCPClient [${this.getId()}] - stop`)
        try {
            await TCPClientModule.stopClient(this.getId(), reason ?? StopReasonEnum.Manual)
            this.logger?.log(`TCPClient [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPClient [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
