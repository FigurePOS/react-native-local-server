import { StateObject } from "../../../rootReducer"
import { CounterDataStateObject } from "./reducer"

export const getCounterData = (state: StateObject): CounterDataStateObject => state.Counter.data

export const getCounterCount = (state: StateObject): number => getCounterData(state).count

export const isCounterAutoIncrementOn = (state: StateObject): boolean => getCounterData(state).autoIncrementOn
