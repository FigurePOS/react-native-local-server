import { prepend } from "ramda"
import { Reducer } from "redux"

import { LoggerMessage } from "../../../common/components/loggerView/types"
import { StateAction } from "../../../types"

import {
    COUNTER_AUTO_INCREMENT_STARTED,
    COUNTER_AUTO_INCREMENT_STOPPED,
    COUNTER_COUNT_CHANGED,
    COUNTER_LOG_CLEAR_REQUESTED,
    COUNTER_LOGGED,
} from "./actionts"



export type CounterDataStateObject = {
    count: number
    autoIncrementOn: boolean
    logData: LoggerMessage[]
}

export const createDefaultState = (): CounterDataStateObject => ({
    count: 0,
    autoIncrementOn: false,
    logData: [],
})

export const counterDataReducer: Reducer = (
    state: CounterDataStateObject = createDefaultState(),
    action: StateAction,
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
        case COUNTER_LOGGED:
            return {
                ...state,
                logData: prepend(action.payload.log, state.logData),
            }
        case COUNTER_LOG_CLEAR_REQUESTED:
            return {
                ...state,
                logData: [],
            }
        default:
            return state
    }
}
