export enum CounterMessageType {
    CountChanged = "TEXT_MESSAGE_SENT",
    CountResetRequested = "COUNT_RESET_REQUESTED",
    CountRequested = "COUNT_REQUESTED",
}

export type CounterMessageCountChanged = {
    type: CounterMessageType.CountChanged
    payload: {
        count: number
    }
}

export const createCounterMessageCountChanged = (count: number): CounterMessageCountChanged => ({
    type: CounterMessageType.CountChanged,
    payload: {
        count: count,
    },
})

export type CounterMessageCountResetRequested = {
    type: CounterMessageType.CountResetRequested
}

export const createCounterMessageCountResetRequested = (): CounterMessageCountResetRequested => ({
    type: CounterMessageType.CountResetRequested,
})

export type CounterMessageCountRequested = {
    type: CounterMessageType.CountRequested
}

export const createCounterMessageCountRequested = (): CounterMessageCountRequested => ({
    type: CounterMessageType.CountRequested,
})

export type CounterMessage =
    | CounterMessageCountChanged
    | CounterMessageCountResetRequested
    | CounterMessageCountRequested
