import { Logger, LoggerVerbosity } from "@figuredev/react-native-local-server"
import { store } from "../../../configureStore"
import { createActionCounterLogged } from "../data/actionts"

export const CounterLogger: Logger = {
    verbosity: LoggerVerbosity.TCP,
    log: (message, data) => {
        store.dispatch(createActionCounterLogged({ type: "info", message: message, data: data }))
    },
    warn: (message, data) => {
        store.dispatch(createActionCounterLogged({ type: "warn", message: message, data: data }))
    },
    error: (message, data) => {
        store.dispatch(createActionCounterLogged({ type: "error", message: message, data: data }))
    },
}
