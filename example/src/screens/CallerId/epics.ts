import { Epic, ofType } from "redux-observable"
import { defer, Observable } from "rxjs"
import { catchError, map, mapTo, switchMap } from "rxjs/operators"

import {
    CallerIdServerStatusEvent,
    CallerIdServerStatusEventName,
    PhoneCall,
} from "@figuredev/react-native-local-server"

import { StateAction } from "../../types"

import {
    CALLER_ID_SERVER_SIMULATE_CALL_REQUESTED,
    CALLER_ID_SERVER_START_REQUESTED,
    CALLER_ID_SERVER_STOP_REQUESTED,
    createActionCallerIdServerCallDetected,
    createActionCallerIdServerErrored,
    createActionCallerIdServerReady,
    createActionCallerIdServerStartFailed,
    createActionCallerIdServerStartSucceeded,
    createActionCallerIdServerStopped,
} from "./actions"
import { ExampleCallerIdServer } from "./network"


const callerIdServerStartRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(CALLER_ID_SERVER_START_REQUESTED),
        switchMap(() => {
            return defer(() => ExampleCallerIdServer.start()).pipe(
                mapTo(createActionCallerIdServerStartSucceeded()),
                catchError((err) => [createActionCallerIdServerStartFailed(err)]),
            )
        }),
    )

const callerIdServerStopRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(CALLER_ID_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => ExampleCallerIdServer.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionCallerIdServerErrored(err)]),
            )
        }),
    )

const callerIdServerSimulateCallRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(CALLER_ID_SERVER_SIMULATE_CALL_REQUESTED),
        switchMap((action: StateAction) => {
            const call: PhoneCall = {
                number: action.payload.phoneNumber,
                name: action.payload.name,
            }
            return defer(() => ExampleCallerIdServer.simulateCall(call)).pipe(
                switchMap(() => []),
                catchError((err) => [createActionCallerIdServerErrored(err)]),
            )
        }),
    )

const callerIdServerStatusEventEpic: Epic = () =>
    ExampleCallerIdServer.getStatusEvent$().pipe(
        switchMap((event: CallerIdServerStatusEvent) => {
            switch (event.type) {
                case CallerIdServerStatusEventName.Ready:
                    return [createActionCallerIdServerReady()]
                case CallerIdServerStatusEventName.Stopped:
                    return [createActionCallerIdServerStopped(null)]
                default:
                    return []
            }
        }),
    )

const callerIdServerIncomingCallEpic: Epic = () =>
    ExampleCallerIdServer.getIncomingCall$().pipe(map(createActionCallerIdServerCallDetected))

export default [
    callerIdServerStartRequestedEpic,
    callerIdServerStatusEventEpic,
    callerIdServerStopRequestedEpic,
    callerIdServerSimulateCallRequestedEpic,
    callerIdServerIncomingCallEpic,
]
