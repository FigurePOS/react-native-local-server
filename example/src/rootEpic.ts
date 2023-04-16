import { ActionsObservable, combineEpics, Epic, StateObservable } from "redux-observable"
import { StateAction } from "./types"
import { StateObject } from "./rootReducer"
import TCPServerEpics from "./screens/TCPServer/epics"
import TCPClientEpics from "./screens/TCPClient/epics"
import UDPServerEpics from "./screens/UDPServer/epics"
import MessagingServerEpics from "./screens/MessagingServer/epics"
import MessagingClientEpics from "./screens/MessagingClient/epics"
import CounterEpics from "./screens/Counter/epics"
import CallerIdEpics from "./screens/CallerId/epics"
import ServiceBrowserEpics from "./screens/ServiceBrowser/epics"

const epics: Epic[] = [
    ...TCPServerEpics,
    ...TCPClientEpics,
    ...UDPServerEpics,
    ...MessagingServerEpics,
    ...MessagingClientEpics,
    ...CounterEpics,
    ...CallerIdEpics,
    ...ServiceBrowserEpics,
]

export const rootEpic: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>,
    deps: any
) => combineEpics(...epics)(action$, state$, deps)
