import { ServiceBrowserConfiguration } from "./types"
import { ServiceBrowserModule } from "./module"
import { NativeEventEmitter } from "react-native"
import { ServiceBrowserEventName } from "./nativeEvents"
import { Logger, LoggerVerbosity, LoggerWrapper } from "../../utils/logger"

const eventEmitter = new NativeEventEmitter(ServiceBrowserModule)

/**
 * Implementation of Service Browser
 */
export class ServiceBrowser {
    private readonly id: string
    static readonly EventName = ServiceBrowserEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    private logger: LoggerWrapper = new LoggerWrapper()
    private config: ServiceBrowserConfiguration | null = null

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
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity?: LoggerVerbosity) => {
        this.logger.setLogger(logger, verbosity ?? LoggerVerbosity.Medium)
    }

    /**
     * This method returns last configuration of the server.
     */
    getConfiguration = (): ServiceBrowserConfiguration | null => {
        return this.config
    }

    /**
     * This method starts the browser.
     * @param configuration - configuration of the browser
     */
    start = async (configuration: ServiceBrowserConfiguration): Promise<void> => {
        this.logger.log(LoggerVerbosity.Medium, `ServiceBrowser [${this.getId()}] - start`, configuration)
        this.config = configuration
        try {
            await ServiceBrowserModule.createBrowser(this.getId(), this.config.type)
            this.logger.log(LoggerVerbosity.Medium, `ServiceBrowser [${this.getId()}] - start - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger.error(LoggerVerbosity.Low, `ServiceBrowser [${this.getId()}] - start - error`, e)
            return Promise.reject(e)
        }
    }

    /**
     * This method stops service browsing.
     */
    stop = async (): Promise<void> => {
        this.logger.log(LoggerVerbosity.Medium, `ServiceBrowser [${this.getId()}] - stop`)
        try {
            await ServiceBrowserModule.stopBrowser(this.getId())
            this.logger.log(LoggerVerbosity.Medium, `ServiceBrowser [${this.getId()}] - stop - success`)
            return Promise.resolve()
        } catch (e) {
            this.logger.error(LoggerVerbosity.Low, `ServiceBrowser [${this.getId()}] - stop - error`, e)
            return Promise.reject(e)
        }
    }
}
