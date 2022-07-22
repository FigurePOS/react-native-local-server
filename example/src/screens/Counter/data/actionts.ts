import { LoggerMessage } from "../../../common/components/loggerView/types"

export const COUNTER_COUNT_CHANGED = "COUNTER_COUNT_CHANGED"
export const createActionCounterCountChanged = (count: number) => ({
    type: COUNTER_COUNT_CHANGED,
    payload: {
        count: count,
    },
})

export const COUNTER_COUNT_INCREMENTED = "COUNTER_COUNT_INCREMENTED"
export const createActionCounterCountIncremented = () => ({
    type: COUNTER_COUNT_INCREMENTED,
})

export const COUNTER_COUNT_DECREASED = "COUNTER_COUNT_DECREASED"
export const createActionCounterCountDecreased = () => ({
    type: COUNTER_COUNT_DECREASED,
})

export const COUNTER_COUNT_RESET_REQUESTED = "COUNTER_COUNT_RESET_REQUESTED"
export const createActionCounterCountResetRequested = () => ({
    type: COUNTER_COUNT_RESET_REQUESTED,
})

export const COUNTER_COUNT_RESET = "COUNTER_COUNT_RESET"
export const createActionCounterCountReset = () => ({
    type: COUNTER_COUNT_RESET,
})

export const COUNTER_AUTO_INCREMENT_STARTED = "COUNTER_AUTO_INCREMENT_STARTED"
export const createActionCounterAutoIncrementStarted = () => ({
    type: COUNTER_AUTO_INCREMENT_STARTED,
})

export const COUNTER_AUTO_INCREMENT_STOPPED = "COUNTER_AUTO_INCREMENT_STOPPED"
export const createActionCounterAutoIncrementStopped = () => ({
    type: COUNTER_AUTO_INCREMENT_STOPPED,
})

export const COUNTER_LOGGED = "COUNTER_LOGGED"
export const createActionCounterLogged = (log: LoggerMessage) => ({
    type: COUNTER_LOGGED,
    payload: {
        log: log,
    },
})

export const COUNTER_LOG_CLEAR_REQUESTED = "COUNTER_LOG_CLEAR_REQUESTED"
export const createActionCounterLogClearRequested = () => ({
    type: COUNTER_LOG_CLEAR_REQUESTED,
})
