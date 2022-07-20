import { combineReducers } from "redux"
import { TCPServerReducer } from "./screens/TCPServer/reducer"
import { TCPClientReducer } from "./screens/TCPClient/reducer"

export const rootReducer = combineReducers({
    TCPServer: TCPServerReducer,
    TCPClient: TCPClientReducer,
})

export type StateObject = ReturnType<typeof rootReducer>
