import { Epic, ofType } from "redux-observable"
import { Observable } from "rxjs"
import { catchError, mergeMap, switchMap } from "rxjs/operators"

import {
    MessagingClientConfiguration,
    MessagingClientConnectionMethod,
    MessagingClientStatusEventName,
} from "@figuredev/react-native-local-server"

import { createMessageData } from "../../common/components/messaging/functions"
import { ClientState } from "../../common/types"
import { EpicDependencies } from "../../configureStore"
import { StateAction } from "../../types"

import {
    createActionMessagingClientDataReceived,
    createActionMessagingClientErrored,
    createActionMessagingClientStateChanged,
    MESSAGING_CLIENT_DATA_SEND_REQUESTED,
    MESSAGING_CLIENT_START_REQUESTED,
    MESSAGING_CLIENT_STOP_REQUESTED,
} from "./actions"
import { SampleMessagingClient } from "./localCommunication/client"
import { createMessageTextMessageSent } from "./localCommunication/messages"
import { rootHandler } from "./localCommunication/rootHandler"

const messagingClientStartRequested: Epic = (
    action$: Observable<StateAction>,
    _state$,
    dependencies: EpicDependencies,
) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionMessagingClientErrored("Invalid Port")]
            }
            const config: MessagingClientConfiguration = {
                name: "Sample Messaging Client",
                connection: {
                    method: MessagingClientConnectionMethod.Raw,
                    port: port,
                    host: action.payload.host,
                },
            }
            return SampleMessagingClient.start(config, rootHandler, dependencies).pipe(
                switchMap(() => []),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionMessagingClientErrored(message)]
                }),
            )
        }),
    )

const messagingClientStatus: Epic = () =>
    SampleMessagingClient.getStatusEvent$().pipe(
        mergeMap((e) => {
            switch (e.type) {
                case MessagingClientStatusEventName.Ready:
                    return [createActionMessagingClientStateChanged(ClientState.Ready)]
                case MessagingClientStatusEventName.Stopped:
                    return [createActionMessagingClientStateChanged(ClientState.StandBy)]
                default:
                    return []
            }
        }),
        catchError((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err)
            return [createActionMessagingClientErrored(message)]
        }),
    )

const messagingClientStopRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return SampleMessagingClient.stop().pipe(
                switchMap(() => []),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionMessagingClientErrored(message)]
                }),
            )
        }),
    )

const messagingClientDataSendRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_DATA_SEND_REQUESTED),
        switchMap((action: StateAction) => {
            const text = action.payload.data
            const message = createMessageTextMessageSent(text)
            return SampleMessagingClient.send(message).pipe(
                switchMap(() => {
                    return [createActionMessagingClientDataReceived(createMessageData("client", text))]
                }),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionMessagingClientErrored(message)]
                }),
            )
        }),
    )

export default [
    messagingClientStartRequested,
    messagingClientStatus,
    messagingClientStopRequested,
    messagingClientDataSendRequested,
]
