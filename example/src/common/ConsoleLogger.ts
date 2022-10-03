import { Logger } from "@figuredev/react-native-local-server"

export const ConsoleLogger: Logger = {
    log: console.log,
    warn: console.warn,
    error: console.error,
}
