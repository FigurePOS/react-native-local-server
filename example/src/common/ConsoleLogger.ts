import { Logger, LoggerVerbosity } from "@figuredev/react-native-local-server"

export const ConsoleLogger: Logger = {
    verbosity: LoggerVerbosity.TCP,
    log: console.log,
    warn: console.warn,
    error: console.error,
}
