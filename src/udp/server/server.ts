import { NativeEventEmitter } from "react-native"

import { Logger, LoggerVerbosity, LoggerWrapper } from "../../utils/logger"
import { StopReason, StopReasonEnum } from "../../utils/types"

import { UDPServerModule } from "./module"
import { UDPServerEventName } from "./nativeEvents"
import { UDPServerConfiguration } from "./types"

const eventEmitter = new NativeEventEmitter(UDPServerModule)

/**
 * Implementation of UDP protocol
 */
export class UDPServer {
    private readonly id: string
    static readonly EventName = UDPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: LoggerWrapper = new LoggerWrapper()
    private config: UDPServerConfiguration | null = null

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.id = id
    }

    /**
     * Returns id of the server
     */
    getId = (): string => {
        return this.id
    }

    /**
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity: LoggerVerbosity = LoggerVerbosity.Medium) => {
        this.logger.setLogger(logger, verbosity)
    }

    /**
     * This method returns last configuration of the server
     */
    getConfiguration = (): UDPServerConfiguration | null => {
        return this.config
    }

    /**
     * This method starts the server.
     * Once the UDPServerReadyNativeEvent event is emitted the server is ready to receive data.
     * @param configuration - configuration of the server
     */
    start = async (configuration: UDPServerConfiguration): Promise<void> => {
        this.logger.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - start`, configuration)
        this.config = configuration
        try {
            await UDPServerModule.createServer(
                this.getId(),
                this.config.port,
                this.config.numberOfDroppedBytesFromMsgStart ?? 0,
            )
            this.logger.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - start - success`)
        } catch (e) {
            this.logger.error(LoggerVerbosity.Low, `UDPServer [${this.getId()}] - start - error`, e)
            await Promise.reject(e)
        }
    }

    /**
     * This method sends data to some host.
     * @param host - target host address
     * @param port - target port
     * @param data - data to be sent
     */
    sendData = async (host: string, port: number, data: string): Promise<void> => {
        this.logger.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - sendData`, {
            host: host,
            port: port,
            data: data,
        })
        try {
            await UDPServerModule.send(host, port, data)
            this.logger?.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - sendData - success`)
        } catch (e) {
            this.logger?.error(LoggerVerbosity.Low, `UDPServer [${this.getId()}] - sendData - error`, e)
            await Promise.reject(e)
        }
    }

    /**
     * This method stops the server from receiving data.
     * @param reason - internal reason for stopping the client (it will be reported in UDPServerStoppedNativeEvent)
     */
    stop = async (reason?: StopReason): Promise<void> => {
        this.logger.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - stop`)
        try {
            await UDPServerModule.stopServer(this.getId(), reason ?? StopReasonEnum.Manual)
            this.logger.log(LoggerVerbosity.Medium, `UDPServer [${this.getId()}] - stop - success`)
        } catch (e) {
            this.logger?.error(LoggerVerbosity.Low, `UDPServer [${this.getId()}] - stop - error`, e)
            await Promise.reject(e)
        }
    }
}
