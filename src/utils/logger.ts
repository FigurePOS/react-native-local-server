import { Logger } from "./types"

export const DefaultLogger: Logger = {
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
