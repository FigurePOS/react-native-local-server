import { Epic, ofType, StateObservable } from "redux-observable"
import { from, Observable } from "rxjs"
import { catchError, concatMap, mergeMap, mergeMapTo, switchMap } from "rxjs/operators"
import * as uuid from "uuid"

import { MessagingServerConfiguration, MessagingServerStatusEventName } from "@figuredev/react-native-local-server"

import { filterWithSelector } from "../../../common/operators/filterWithSelector"
import { ServerConnectionState, ServerState } from "../../../common/types"
import { StateObject } from "../../../rootReducer"
import { Maybe, StateAction } from "../../../types"
import { CounterDependencies } from "../common/deps"
import { createCounterMessageCountChanged } from "../common/messages"
import { COUNTER_COUNT_CHANGED } from "../data/actionts"

import {
    COUNTER_SERVER_RESTART_REQUESTED,
    COUNTER_SERVER_START_REQUESTED,
    COUNTER_SERVER_STATE_CHANGED,
    COUNTER_SERVER_STOP_REQUESTED,
    createActionCounterServerConnectionStateChanged,
    createActionCounterServerErrored,
    createActionCounterServerIpAddressChanged,
    createActionCounterServerStateChanged,
} from "./actions"
import { rootHandler } from "./rootHandler"
import { getCounterServerReadyConnections, isCounterServerRunning } from "./selectors"
import { CounterServer } from "./server"





const counterServerStartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = action.payload.port
            const parsedPort = Number.parseInt(port, 10)
            const isPortValid = port.length === 0 || !Number.isNaN(parsedPort)
            if (!isPortValid) {
                return [createActionCounterServerErrored("Invalid Port")]
            }
            const config: MessagingServerConfiguration = {
                name: "Counter Server",
                service: {
                    id: uuid.v4(),
                    name: "My Counter Server",
                },
                discovery: {
                    group: "fgr-counter",
                },
                port: port.length === 0 ? null : parsedPort,
                ping: {
                    interval: 1000,
                    retryCount: 10,
                },
            }
            return CounterServer.start(config, rootHandler, CounterDependencies).pipe(
                mergeMapTo([]),
                catchError((err) => [createActionCounterServerErrored(err)]),
            )
        }),
        catchError((err) => [createActionCounterServerErrored(err)]),
    )

const counterServerStatus: Epic = () =>
    CounterServer.getStatusEvent$().pipe(
        mergeMap((e) => {
            switch (e.type) {
                case MessagingServerStatusEventName.Ready:
                    return [createActionCounterServerStateChanged(ServerState.Ready, e.port)]
                case MessagingServerStatusEventName.Stopped:
                    return [createActionCounterServerStateChanged(ServerState.StandBy, e.port)]
                case MessagingServerStatusEventName.ConnectionAccepted:
                    return [
                        createActionCounterServerConnectionStateChanged(e.connectionId, ServerConnectionState.Accepted),
                    ]
                case MessagingServerStatusEventName.ConnectionReady:
                    return [
                        createActionCounterServerConnectionStateChanged(e.connectionId, ServerConnectionState.Ready),
                    ]
                case MessagingServerStatusEventName.ConnectionClosed:
                    return [
                        createActionCounterServerConnectionStateChanged(e.connectionId, ServerConnectionState.Closed),
                    ]
            }
            return []
        }),
    )

const counterServerStopRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return CounterServer.stop().pipe(
                mergeMapTo([]),
                catchError((err) => [createActionCounterServerErrored(err)]),
            )
        }),
    )

const counterServerRestartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_RESTART_REQUESTED),
        switchMap(() => {
            return CounterServer.restart().pipe(
                mergeMapTo([]),
                catchError((err) => [createActionCounterServerErrored(err)]),
            )
        }),
    )

const counterServerCountChanged: Epic = (action$: Observable<StateAction>, state$: StateObservable<StateObject>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_CHANGED),
        filterWithSelector(isCounterServerRunning, state$),
        switchMap((action: StateAction) => {
            const message = createCounterMessageCountChanged(action.payload.count)
            const connections = getCounterServerReadyConnections(state$.value)
            return from(connections).pipe(
                concatMap((connection) => {
                    return CounterServer.send(message, connection.id).pipe(
                        switchMap(() => {
                            return []
                        }),
                    )
                }),
            )
        }),
        catchError((err) => [createActionCounterServerErrored(err)]),
    )

const counterServerIpAddressEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_SERVER_STATE_CHANGED),
        switchMap(() => {
            return CounterServer.getLocalIpAddress().pipe(
                switchMap((ip: Maybe<string>) => [createActionCounterServerIpAddressChanged(ip)]),
            )
        }),
        catchError((err) => [createActionCounterServerErrored(err)]),
    )

const counterServerHandlersOutput = () => CounterServer.getHandlerOutput$()

export default [
    counterServerStartRequested,
    counterServerStatus,
    counterServerStopRequested,
    counterServerCountChanged,
    counterServerIpAddressEpic,
    counterServerRestartRequested,
    counterServerHandlersOutput,
]
