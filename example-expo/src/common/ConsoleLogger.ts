import { Logger } from "@figuredev/react-native-local-server"

export const ConsoleLogger: Logger = {
    // eslint-disable-next-line no-console
    log: console.log,
    // eslint-disable-next-line no-console
    warn: console.warn,
    // eslint-disable-next-line no-console
    error: console.error,
}
