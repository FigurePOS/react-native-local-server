import { combineReducers } from "redux"
import { TCPServerReducer } from "./screens/TCPServer/reducer"

export const rootReducer = combineReducers({
    TCPServer: TCPServerReducer,
})

export type StateObject = ReturnType<typeof rootReducer>
