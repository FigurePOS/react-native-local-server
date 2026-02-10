import { NativeEventEmitter } from "react-native"

import { Logger, LoggerVerbosity, LoggerWrapper } from "../../utils/logger"
import { StopReason, StopReasonEnum } from "../../utils/types"

import { TCPClientModule } from "./module"
import { TCPClientEventName } from "./nativeEvents"
import type { TCPClientConfiguration } from "./types"
import { TCPClientConnectionConfiguration, TCPClientConnectionMethod } from "./types"

const eventEmitter = new NativeEventEmitter(TCPClientModule)

/**
 * Implementation of TCP protocol (client)
 */
export class TCPClient {
    private readonly id: string
    static readonly EventName = TCPClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: LoggerWrapper = new LoggerWrapper()
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
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity?: LoggerVerbosity) => {
        this.logger.setLogger(logger, verbosity ?? LoggerVerbosity.Medium)
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
        this.logger.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - start`, configuration)
        try {
            this.configuration = configuration
            await this.connect(configuration.connection)
            this.logger.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - start - success`)
        } catch (e) {
            this.logger.error(LoggerVerbosity.Low, `TCPClient [${this.getId()}] - start - error`, e)
            await Promise.reject(e)
        }
    }

    /**
     * This method sends data to the server.
     * @param data - data to be sent
     */
    sendData = async (data: string): Promise<void> => {
        this.logger?.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - sendData`, { data: data })
        try {
            await TCPClientModule.send(this.getId(), data)
            this.logger?.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - sendData - success`)
        } catch (e) {
            this.logger?.error(LoggerVerbosity.Low, `TCPClient [${this.getId()}] - sendData - error`, e)
            await Promise.reject(e)
        }
    }

    /**
     * This method stops the client.
     * @param reason - internal reason for stopping the client (it will be reported in TCPClientStoppedNativeEvent)     */
    stop = async (reason?: StopReason): Promise<void> => {
        this.logger?.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - stop`)
        try {
            await TCPClientModule.stopClient(this.getId(), reason ?? StopReasonEnum.Manual)
            this.logger?.log(LoggerVerbosity.Medium, `TCPClient [${this.getId()}] - stop - success`)
        } catch (e) {
            this.logger?.error(LoggerVerbosity.Low, `TCPClient [${this.getId()}] - stop - error`, e)
            await Promise.reject(e)
        }
    }

    private connect = (connection: TCPClientConnectionConfiguration): Promise<void> => {
        switch (connection.method) {
            case TCPClientConnectionMethod.Raw:
                return TCPClientModule.createClient(this.getId(), connection.host, connection.port)
            case TCPClientConnectionMethod.Discovery:
                return TCPClientModule.createClientFromDiscovery(this.getId(), connection.group, connection.name)
            default:
                return Promise.reject(new Error("Unknown connection method"))
        }
    }
}
