import { StateAction } from "../../../types"
import { Reducer } from "redux"
import { COUNTER_AUTO_INCREMENT_STARTED, COUNTER_AUTO_INCREMENT_STOPPED, COUNTER_COUNT_CHANGED } from "./actionts"

export type CounterDataStateObject = {
    count: number
    autoIncrementOn: boolean
}

export const createDefaultState = (): CounterDataStateObject => ({
    count: 0,
    autoIncrementOn: false,
})

export const counterDataReducer: Reducer = (
    state: CounterDataStateObject = createDefaultState(),
    action: StateAction
): CounterDataStateObject => {
    switch (action.type) {
        case COUNTER_COUNT_CHANGED:
            return {
                ...state,
                count: action.payload.count,
            }
        case COUNTER_AUTO_INCREMENT_STARTED:
            return {
                ...state,
                autoIncrementOn: true,
            }
        case COUNTER_AUTO_INCREMENT_STOPPED:
            return {
                ...state,
                autoIncrementOn: false,
            }
        default:
            return state
    }
}
