import { Logger, LoggerVerbosity } from "./types"

export const DefaultLogger: Logger = {
    verbosity: LoggerVerbosity.Messaging,
    log: (message, data) => {
        console.log(message, data)
    },
    warn: (message, data) => {
        console.warn(message, data)
    },
    error: (message, data) => {
        console.error(message, data)
    },
}
