import { ActionsObservable, Epic, ofType, StateObservable } from "redux-observable"
import { StateAction } from "../../../types"
import { catchError, concatMap, mergeMap, switchMap } from "rxjs/operators"
import { MessagingServerConfiguration, MessagingServerStatusEventName } from "@figuredev/react-native-local-server"
import { ServerConnectionState, ServerState } from "../../../common/types"
import {
    COUNTER_SERVER_START_REQUESTED,
    COUNTER_SERVER_STOP_REQUESTED,
    createActionCounterServerConnectionStateChanged,
    createActionCounterServerErrored,
    createActionCounterServerStateChanged,
} from "./actions"
import { CounterServer } from "./server"
import { CounterDependencies } from "../common/deps"
import { rootHandler } from "./rootHandler"
import { COUNTER_COUNT_CHANGED } from "../data/actionts"
import { createCounterMessageCountChanged } from "../common/messages"
import { createActionCounterClientErrored } from "../client/actions"
import { StateObject } from "../../../rootReducer"
import { getCounterServerReadyConnections, isCounterServerRunning } from "./selectors"
import { from } from "rxjs"
import { filterWithSelector } from "../../../common/operators/filterWithSelector"

const counterServerStartRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_START_REQUESTED),
        switchMap((action) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionCounterServerErrored("Invalid Port")]
            }
            const config: MessagingServerConfiguration = {
                name: "Counter Server",
                port: port,
            }
            return CounterServer.start(config, rootHandler, CounterDependencies).pipe(
                mergeMap((e) => {
                    switch (e.type) {
                        case MessagingServerStatusEventName.Ready:
                            return [createActionCounterServerStateChanged(ServerState.Ready)]
                        case MessagingServerStatusEventName.Stopped:
                            return [createActionCounterServerStateChanged(ServerState.StandBy)]
                        case MessagingServerStatusEventName.ConnectionAccepted:
                            return [
                                createActionCounterServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Accepted
                                ),
                            ]
                        case MessagingServerStatusEventName.ConnectionReady:
                            return [
                                createActionCounterServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Ready
                                ),
                            ]
                        case MessagingServerStatusEventName.ConnectionClosed:
                            return [
                                createActionCounterServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Closed
                                ),
                            ]
                    }
                    return []
                })
            )
        }),
        catchError((err) => [createActionCounterServerErrored(err)])
    )

const counterServerStopRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return CounterServer.stop().pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionCounterServerErrored(err)])
    )

const counterServerCountChanged: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>
) =>
    action$.pipe(
        ofType(COUNTER_COUNT_CHANGED),
        filterWithSelector(isCounterServerRunning, state$),
        switchMap((action) => {
            const message = createCounterMessageCountChanged(action.payload.count)
            const connections = getCounterServerReadyConnections(state$.value)
            return from(connections).pipe(
                concatMap((connection) => {
                    return CounterServer.send(message, connection.id).pipe(
                        switchMap(() => {
                            return []
                        })
                    )
                })
            )
        }),
        catchError((err) => [createActionCounterClientErrored(err)])
    )

export default [counterServerStartRequested, counterServerStopRequested, counterServerCountChanged]
