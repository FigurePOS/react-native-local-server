import { combineReducers } from "redux"
import { counterDataReducer } from "./data/reducer"

export const counterReducer = combineReducers({
    data: counterDataReducer,
})
