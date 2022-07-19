import { ActionsObservable, combineEpics, Epic, StateObservable } from "redux-observable"
import { StateAction } from "./types"
import { StateObject } from "./rootReducer"
import TCPServerEpics from "./screens/TCP/TCPServer/epics"
import TCPClientEpics from "./screens/TCP/TCPClient/epics"

const epics: Epic[] = [...TCPServerEpics, ...TCPClientEpics]

export const rootEpic: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>,
    deps: any
) => combineEpics(...epics)(action$, state$, deps)
