import { StateObject } from "../../../rootReducer"
import { CounterDataStateObject } from "./reducer"
import { LoggerMessage } from "../../../common/components/loggerView/types"

export const getCounterData = (state: StateObject): CounterDataStateObject => state.Counter.data

export const getCounterCount = (state: StateObject): number => getCounterData(state).count

export const isCounterAutoIncrementOn = (state: StateObject): boolean => getCounterData(state).autoIncrementOn

export const getCounterLogData = (state: StateObject): LoggerMessage[] => getCounterData(state).logData
