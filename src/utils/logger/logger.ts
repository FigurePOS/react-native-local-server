import { Logger } from "./types"

export const DefaultLogger: Logger = {
    log: (message, data) => {
        // eslint-disable-next-line no-console
        console.log(message, data)
    },
    warn: (message, data) => {
        // eslint-disable-next-line no-console
        console.warn(message, data)
    },
    error: (message, data) => {
        // eslint-disable-next-line no-console
        console.error(message, data)
    },
}
