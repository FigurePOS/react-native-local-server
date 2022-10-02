import type { TCPServerConfiguration } from "./types"
import { TCPServerModule } from "./module"
import { NativeEventEmitter } from "react-native"
import { TCPServerEventName } from "./nativeEvents"
import { Logger, StopReason, StopReasonEnum } from "../../utils/types"

const eventEmitter = new NativeEventEmitter(TCPServerModule)

/**
 * Implementation of TCP protocol (server)
 */
export class TCPServer {
    private readonly id: string
    static readonly EventName = TCPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: Logger | null = null
    private config: TCPServerConfiguration | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.id = id
    }

    /**
     * Returns id of the server.
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
     * This method returns last configuration of the server.
     */
    getConfiguration = (): TCPServerConfiguration | null => {
        return this.config
    }

    /**
     * This method returns local IP address.
     * If the device is not connected to any Wi-Fi it returns null.
     */
    getLocalIpAddress = async (): Promise<string | null> => {
        this.logger?.log(`TCPServer [${this.getId()}] - getLocalIpAddress`)
        try {
            const ip: string | null = await TCPServerModule.getLocalIpAddress()
            this.logger?.log(`TCPServer [${this.getId()}] - getLocalIpAddress - success`, { ip: ip })
            return Promise.resolve(ip)
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - getLocalIpAddress - error`, e)
            return Promise.reject(e)
        }
    }

    /**
     * This method starts the server.
     * Once the TCPServerReadyNativeEvent event is emitted the server is ready to accept connections.
     * @param configuration - configuration of the server
     */
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

    /**
     * This method sends data to active connection.
     * @param connectionId - target connection id
     * @param data - data to be sent
     */
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

    /**
     * This method closes active connection.
     * @param connectionId - target connection id
     * @param reason - internal reason for closing the connection (it will be reported in TCPServerConnectionClosedNativeEvent)
     */
    closeConnection = async (connectionId: string, reason?: StopReason): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - closeConnection`, { connectionId: connectionId })
        try {
            await TCPServerModule.closeConnection(this.getId(), connectionId, reason ?? StopReasonEnum.Manual)
            this.logger?.log(`TCPServer [${this.getId()}] - closeConnection - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - closeConnection - error`, e)
            return Promise.reject(e)
        }
    }

    /**
     * This method returns array of all active connection ids.
     */
    getConnectionIds = async (): Promise<string[]> => {
        this.logger?.log(`TCPServer [${this.getId()}] - getConnectionIds`)
        try {
            const result: string[] = await TCPServerModule.getConnectionIds(this.getId())
            this.logger?.log(`TCPServer [${this.getId()}] - getConnectionIds - success`, result)
            return Promise.resolve(result)
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - getConnectionIds - error`, e)
            return Promise.reject(e)
        }
    }

    /**
     * This method closes all active connections and stops the server from accepting new connections.
     * @param reason - reason for stopping the server
     */
    stop = async (reason?: StopReason): Promise<void> => {
        this.logger?.log(`TCPServer [${this.getId()}] - stop`)
        try {
            await TCPServerModule.stopServer(this.getId(), reason ?? StopReasonEnum.Manual)
            this.logger?.log(`TCPServer [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger?.error(`TCPServer [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
