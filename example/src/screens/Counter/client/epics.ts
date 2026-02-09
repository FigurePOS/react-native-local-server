import { Epic, ofType, StateObservable } from "redux-observable"
import { Observable } from "rxjs"
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators"

import {
    MessagingClientConfiguration,
    MessagingClientConnectionMethod,
    MessagingClientStatusEventName,
} from "@figuredev/react-native-local-server"

import { filterWithSelector } from "../../../common/operators/filterWithSelector"
import { ClientState } from "../../../common/types"
import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"
import { CounterDependencies } from "../common/deps"
import { createCounterMessageCountRequested, createCounterMessageCountResetRequested } from "../common/messages"
import { COUNTER_COUNT_RESET_REQUESTED } from "../data/actionts"

import {
    COUNTER_CLIENT_RESTART_REQUESTED,
    COUNTER_CLIENT_SEARCH_RESTART_REQUESTED,
    COUNTER_CLIENT_SEARCH_START_REQUESTED,
    COUNTER_CLIENT_SEARCH_STOP_REQUESTED,
    COUNTER_CLIENT_START_FROM_SERVICE_REQUESTED,
    COUNTER_CLIENT_START_REQUESTED,
    COUNTER_CLIENT_STATE_CHANGED,
    COUNTER_CLIENT_STOP_REQUESTED,
    createActionCounterClientAvailableServicesChanged,
    createActionCounterClientErrored,
    createActionCounterClientSearchErrored,
    createActionCounterClientSearchStateChanged,
    createActionCounterClientStateChanged,
} from "./actions"
import { CounterClient } from "./client"
import { rootHandler } from "./rootHandler"
import { getCounterClientAvailableServices, isCounterClientRunning } from "./selectors"

const counterClientStartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionCounterClientErrored("Invalid Port")]
            }
            const config: MessagingClientConfiguration = {
                name: "Counter Client",
                connection: {
                    method: MessagingClientConnectionMethod.Raw,
                    port: port,
                    host: action.payload.host,
                },
                ping: {
                    timeout: 10 * 1000,
                },
            }
            return CounterClient.start(config, rootHandler, CounterDependencies).pipe(
                mergeMap(() => []),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientStartFromServiceRequested: Epic = (
    action$: Observable<StateAction>,
    state$: StateObservable<StateObject>,
) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_START_FROM_SERVICE_REQUESTED),
        switchMap((action: StateAction) => {
            const { serviceId } = action.payload
            const availableServices = getCounterClientAvailableServices(state$.value)
            const service = availableServices.find((s) => s.shortId === serviceId)
            if (!service) {
                return []
            }
            const config: MessagingClientConfiguration = {
                name: "Counter Client",
                connection: {
                    method: MessagingClientConnectionMethod.Service,
                    service: service,
                },
                ping: {
                    timeout: 10 * 1000,
                },
            }
            return CounterClient.start(config, rootHandler, CounterDependencies).pipe(
                mergeMap(() => []),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientStatus: Epic = () =>
    CounterClient.getStatusEvent$().pipe(
        mergeMap((e) => {
            switch (e.type) {
                case MessagingClientStatusEventName.Ready:
                    return [createActionCounterClientStateChanged(ClientState.Ready)]
                case MessagingClientStatusEventName.Stopped:
                    return [createActionCounterClientStateChanged(ClientState.StandBy)]
                case MessagingClientStatusEventName.ServiceSearchStarted:
                    return [createActionCounterClientSearchStateChanged(ClientState.Ready)]
                case MessagingClientStatusEventName.ServiceSearchStopped:
                    return [createActionCounterClientSearchStateChanged(ClientState.StandBy)]
                default:
                    return []
            }
        }),
    )

const counterClientStopRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return CounterClient.stop().pipe(
                mergeMap(() => []),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientRestartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_RESTART_REQUESTED),
        switchMap(() => {
            return CounterClient.restart().pipe(
                mergeMap(() => []),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientCountResetRequested: Epic = (
    action$: Observable<StateAction>,
    state$: StateObservable<StateObject>,
) =>
    action$.pipe(
        ofType(COUNTER_COUNT_RESET_REQUESTED),
        filterWithSelector(isCounterClientRunning, state$),
        switchMap(() => {
            const message = createCounterMessageCountResetRequested()
            return CounterClient.send(message).pipe(
                switchMap(() => {
                    return []
                }),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientCountRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_STATE_CHANGED),
        filter((action: StateAction) => action.payload.state === ClientState.Ready),
        switchMap(() => {
            const message = createCounterMessageCountRequested()
            return CounterClient.send(message).pipe(
                switchMap(() => {
                    return []
                }),
                catchError((err: unknown) => [createActionCounterClientErrored(err)]),
            )
        }),
    )

const counterClientSearchStartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_SEARCH_START_REQUESTED),
        switchMap(() => {
            return CounterClient.startServiceSearch().pipe(
                switchMap(() => []),
                catchError((err: unknown) => [createActionCounterClientSearchErrored(err)]),
            )
        }),
    )

const counterClientSearchStopRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_SEARCH_STOP_REQUESTED),
        switchMap(() => {
            return CounterClient.stopServiceSearch().pipe(
                switchMap(() => []),
                catchError((err: unknown) => [createActionCounterClientSearchErrored(err)]),
            )
        }),
    )

const counterClientSearchRestartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_CLIENT_SEARCH_RESTART_REQUESTED),
        switchMap(() => {
            return CounterClient.restartServiceSearch().pipe(
                switchMap(() => []),
                catchError((err: unknown) => [createActionCounterClientSearchErrored(err)]),
            )
        }),
    )

const counterClientSearchUpdate: Epic = () =>
    CounterClient.getSearchUpdate$().pipe(
        mergeMap((event) => {
            return [createActionCounterClientAvailableServicesChanged(event.services)]
        }),
    )

const counterClientHandlersOutput = () => CounterClient.getHandlerOutput$()

export default [
    counterClientStartRequested,
    counterClientStartFromServiceRequested,
    counterClientStatus,
    counterClientStopRequested,
    counterClientCountResetRequested,
    counterClientCountRequested,
    counterClientRestartRequested,
    counterClientSearchStartRequested,
    counterClientSearchStopRequested,
    counterClientSearchRestartRequested,
    counterClientSearchUpdate,
    counterClientHandlersOutput,
]
