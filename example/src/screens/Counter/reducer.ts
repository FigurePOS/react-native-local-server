import { combineReducers } from "redux"
import { counterDataReducer } from "./data/reducer"
import { counterServerReducer } from "./server/reducer"
import { counterClientReducer } from "./client/reducer"

export const counterReducer = combineReducers({
    server: counterServerReducer,
    client: counterClientReducer,
    data: counterDataReducer,
})
