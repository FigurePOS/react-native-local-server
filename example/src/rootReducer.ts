import { combineReducers } from "redux"
import { TCPServerReducer } from "./screens/TCP/TCPServer/reducer"
import { TCPClientReducer } from "./screens/TCP/TCPClient/reducer"

export const rootReducer = combineReducers({
    TCPServer: TCPServerReducer,
    TCPClient: TCPClientReducer,
})

export type StateObject = ReturnType<typeof rootReducer>
