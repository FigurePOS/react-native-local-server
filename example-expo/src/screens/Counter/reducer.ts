import { combineReducers } from "redux"

import { counterClientReducer } from "./client/reducer"
import { counterDataReducer } from "./data/reducer"
import { counterServerReducer } from "./server/reducer"

export const counterReducer = combineReducers({
    server: counterServerReducer,
    client: counterClientReducer,
    data: counterDataReducer,
})
