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
