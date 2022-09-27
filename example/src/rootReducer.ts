import { combineReducers } from "redux"
import { TCPServerReducer } from "./screens/TCPServer/reducer"
import { TCPClientReducer } from "./screens/TCPClient/reducer"
import { MessagingServerReducer } from "./screens/MessagingServer/reducer"
import { MessagingClientReducer } from "./screens/MessagingClient/reducer"
import { counterReducer } from "./screens/Counter/reducer"
import { UDPServerReducer } from "./screens/UDPServer/reducer"

export const rootReducer = combineReducers({
    TCPServer: TCPServerReducer,
    TCPClient: TCPClientReducer,
    UDPServer: UDPServerReducer,
    MessagingServer: MessagingServerReducer,
    MessagingClient: MessagingClientReducer,
    Counter: counterReducer,
})

export type StateObject = ReturnType<typeof rootReducer>
