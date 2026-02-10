import { combineEpics, Epic, StateObservable } from "redux-observable"
import { Observable } from "rxjs"

import { StateObject } from "./rootReducer"
import CallerIdEpics from "./screens/CallerId/epics"
import CounterEpics from "./screens/Counter/epics"
import MessagingClientEpics from "./screens/MessagingClient/epics"
import MessagingServerEpics from "./screens/MessagingServer/epics"
import ServiceBrowserEpics from "./screens/ServiceBrowser/epics"
import TCPClientEpics from "./screens/TCPClient/epics"
import TCPServerEpics from "./screens/TCPServer/epics"
import UDPServerEpics from "./screens/UDPServer/epics"
import { StateAction } from "./types"

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

export const rootEpic: Epic = (action$: Observable<StateAction>, state$: StateObservable<StateObject>, deps: any) =>
    combineEpics(...epics)(action$, state$, deps)
