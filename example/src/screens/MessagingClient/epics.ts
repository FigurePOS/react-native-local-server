import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import { catchError, mergeMap, switchMap } from "rxjs/operators"
import {
    createActionMessagingClientDataReceived,
    createActionMessagingClientErrored,
    createActionMessagingClientStateChanged,
    MESSAGING_CLIENT_DATA_SEND_REQUESTED,
    MESSAGING_CLIENT_START_REQUESTED,
    MESSAGING_CLIENT_STOP_REQUESTED,
} from "./actions"
import { rootHandler } from "./localCommunication/rootHandler"
import { SampleMessagingClientDependencies } from "./localCommunication/deps"
import { SampleMessagingClient } from "./localCommunication/client"
import { createMessageTextMessageSent } from "./localCommunication/messages"
import {
    composeMessageObject,
    MessagingClientConfiguration,
    MessagingClientStatusEventName,
} from "react-native-local-server"
import { createMessageData } from "../../common/components/messaging/functions"
import { ClientState } from "../../common/types"

const messagingServerClientRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_START_REQUESTED),
        switchMap((action) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionMessagingClientErrored("Invalid Port")]
            }
            const config: MessagingClientConfiguration = {
                port: port,
                host: action.payload.host,
            }
            return SampleMessagingClient.start(config, rootHandler, SampleMessagingClientDependencies).pipe(
                mergeMap((e) => {
                    switch (e.type) {
                        case MessagingClientStatusEventName.Ready:
                            return [createActionMessagingClientStateChanged(ClientState.Ready)]
                        case MessagingClientStatusEventName.Stopped:
                            return [createActionMessagingClientStateChanged(ClientState.StandBy)]
                        default:
                            return []
                    }
                })
            )
        }),
        catchError((err) => [createActionMessagingClientErrored(err)])
    )

const messagingClientStopRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return SampleMessagingClient.stop().pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionMessagingClientErrored(err)])
    )

const messagingClientDataSendRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_CLIENT_DATA_SEND_REQUESTED),
        switchMap((action) => {
            const text = action.payload.data
            const message = createMessageTextMessageSent(text)
            return SampleMessagingClient.send(composeMessageObject(message)).pipe(
                switchMap(() => {
                    return [createActionMessagingClientDataReceived(createMessageData("client", text))]
                })
            )
        }),
        catchError((err) => [createActionMessagingClientErrored(err)])
    )

export default [messagingServerClientRequested, messagingClientStopRequested, messagingClientDataSendRequested]
