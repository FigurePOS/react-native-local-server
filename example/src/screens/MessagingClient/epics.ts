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
import { Maybe, StateAction } from "../../types"
import { createActionCounterServerIpAddressChanged } from "../Counter/server/actions"

import {
    createActionMessagingClientDataReceived,
    createActionMessagingClientErrored,
    createActionMessagingClientStateChanged,
    MESSAGING_CLIENT_DATA_SEND_REQUESTED,
    MESSAGING_CLIENT_START_REQUESTED,
    MESSAGING_CLIENT_STOP_REQUESTED,
} from "./actions"
import { SampleMessagingClient } from "./localCommunication/client"
import { SampleMessagingClientDependencies } from "./localCommunication/deps"
import { createMessageTextMessageSent } from "./localCommunication/messages"
import { rootHandler } from "./localCommunication/rootHandler"

const messagingClientStartRequested: Epic = (action$: Observable<StateAction>) =>
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
            return SampleMessagingClient.start(config, rootHandler, SampleMessagingClientDependencies).pipe(
                switchMap(() => []),
                switchMap((ip: Maybe<string>) => [createActionCounterServerIpAddressChanged(ip)]),
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
