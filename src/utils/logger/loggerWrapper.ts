import { DefaultLogger } from "./logger"
import { Logger, LoggerVerbosity } from "./types"

export class LoggerWrapper {
    private logger: Logger | null = DefaultLogger
    private verbosity: LoggerVerbosity = LoggerVerbosity.Medium

    setLogger(logger: Logger | null, verbosity: LoggerVerbosity = LoggerVerbosity.Medium) {
        this.logger = logger
        this.verbosity = verbosity
    }

    log(verbosity: LoggerVerbosity, message: string, data?: unknown) {
        if (verbosity <= this.verbosity) {
            this.logger?.log(message, data)
        }
    }
    warn(verbosity: LoggerVerbosity, message: string, data: unknown) {
        if (verbosity <= this.verbosity) {
            this.logger?.warn(message, data)
        }
    }
    error(verbosity: LoggerVerbosity, message: string, data?: unknown) {
        if (verbosity <= this.verbosity) {
            this.logger?.error(message, data)
        }
    }
}
