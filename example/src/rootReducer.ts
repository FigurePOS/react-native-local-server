import { combineReducers } from "redux"

import { CallerIdServerReducer } from "./screens/CallerId/reducer"
import { counterReducer } from "./screens/Counter/reducer"
import { MessagingClientReducer } from "./screens/MessagingClient/reducer"
import { MessagingServerReducer } from "./screens/MessagingServer/reducer"
import { ServiceBrowserReducer } from "./screens/ServiceBrowser/reducer"
import { TCPClientReducer } from "./screens/TCPClient/reducer"
import { TCPServerReducer } from "./screens/TCPServer/reducer"
import { UDPServerReducer } from "./screens/UDPServer/reducer"

export const rootReducer = combineReducers({
    TCPServer: TCPServerReducer,
    TCPClient: TCPClientReducer,
    UDPServer: UDPServerReducer,
    MessagingServer: MessagingServerReducer,
    MessagingClient: MessagingClientReducer,
    Counter: counterReducer,
    CallerID: CallerIdServerReducer,
    ServiceBrowser: ServiceBrowserReducer,
})

export type StateObject = ReturnType<typeof rootReducer>
