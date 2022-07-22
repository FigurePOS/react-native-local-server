import { ActionsObservable, Epic, ofType, StateObservable } from "redux-observable"
import { StateAction } from "../../../types"
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators"
import {
    COUNTER_CLIENT_START_REQUESTED,
    COUNTER_CLIENT_STATE_CHANGED,
    COUNTER_CLIENT_STOP_REQUESTED,
    createActionCounterClientErrored,
    createActionCounterClientStateChanged,
} from "./actions"
import { MessagingClientConfiguration, MessagingClientStatusEventName } from "react-native-local-server"
import { ClientState } from "../../../common/types"
import { CounterDependencies } from "../common/deps"
import { CounterClient } from "./client"
import { rootHandler } from "./rootHandler"
import { createCounterMessageCountRequested, createCounterMessageCountResetRequested } from "../common/messages"
import { COUNTER_COUNT_RESET_REQUESTED } from "../data/actionts"
import { filterWithSelector } from "../../../common/operators/filterWithSelector"
import { isCounterClientRunning } from "./selectors"
import { StateObject } from "../../../rootReducer"

const counterServerClientRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_START_REQUESTED),
        switchMap((action) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionCounterClientErrored("Invalid Port")]
            }
            const config: MessagingClientConfiguration = {
                name: "Counter Client",
                port: port,
                host: action.payload.host,
            }
            return CounterClient.start(config, rootHandler, CounterDependencies).pipe(
                mergeMap((e) => {
                    switch (e.type) {
                        case MessagingClientStatusEventName.Ready:
                            return [createActionCounterClientStateChanged(ClientState.Ready)]
                        case MessagingClientStatusEventName.Stopped:
                            return [createActionCounterClientStateChanged(ClientState.StandBy)]
                        default:
                            return []
                    }
                })
            )
        }),
        catchError((err) => [createActionCounterClientErrored(err)])
    )

const counterClientStopRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return CounterClient.stop().pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionCounterClientErrored(err)])
    )

const counterClientCountResetRequested: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>
) =>
    action$.pipe(
        ofType(COUNTER_COUNT_RESET_REQUESTED),
        filterWithSelector(isCounterClientRunning, state$),
        switchMap(() => {
            const message = createCounterMessageCountResetRequested()
            return CounterClient.send(message).pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionCounterClientErrored(err)])
    )

const counterClientCountRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_STATE_CHANGED),
        filter((action) => action.payload.state === ClientState.Ready),
        switchMap(() => {
            const message = createCounterMessageCountRequested()
            return CounterClient.send(message).pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionCounterClientErrored(err)])
    )

export default [
    counterServerClientRequested,
    counterClientStopRequested,
    counterClientCountResetRequested,
    counterClientCountRequested,
]
