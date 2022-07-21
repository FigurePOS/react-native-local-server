import { ActionsObservable, combineEpics, Epic, StateObservable } from "redux-observable"
import { StateAction } from "./types"
import { StateObject } from "./rootReducer"
import TCPServerEpics from "./screens/TCPServer/epics"
import TCPClientEpics from "./screens/TCPClient/epics"
import MessagingServerEpics from "./screens/MessagingServer/epics"
import MessagingClientEpics from "./screens/MessagingClient/epics"
import CounterEpics from "./screens/Counter/epics"

const epics: Epic[] = [
    ...TCPServerEpics,
    ...TCPClientEpics,
    ...MessagingServerEpics,
    ...MessagingClientEpics,
    ...CounterEpics,
]

export const rootEpic: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>,
    deps: any
) => combineEpics(...epics)(action$, state$, deps)
