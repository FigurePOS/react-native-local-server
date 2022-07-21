import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import { catchError, mergeMap, switchMap } from "rxjs/operators"
import {
    createActionMessagingServerConnectionStateChanged,
    createActionMessagingServerDataReceived,
    createActionMessagingServerErrored,
    createActionMessagingServerStateChanged,
    MESSAGING_SERVER_SEND_MESSAGE_REQUESTED,
    MESSAGING_SERVER_START_REQUESTED,
    MESSAGING_SERVER_STOP_REQUESTED,
} from "./actions"
import { SampleMessagingServer } from "./localCommunication/server"
import { rootHandler } from "./localCommunication/rootHandler"
import { SampleMessagingServerDependencies } from "./localCommunication/deps"
import { MessagingServerConfiguration, MessagingServerStatusEventName } from "react-native-local-server"
import { ServerConnectionState, ServerState } from "../../common/types"
import { createMessageTextMessageSent } from "./localCommunication/messages"
import { createMessageData } from "../../common/components/messaging/functions"

const messagingServerStartRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_START_REQUESTED),
        switchMap((action) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionMessagingServerErrored("Invalid Port")]
            }
            const config: MessagingServerConfiguration = {
                name: "Sample Messaging Server",
                port: port,
            }
            return SampleMessagingServer.start(config, rootHandler, SampleMessagingServerDependencies).pipe(
                mergeMap((e) => {
                    switch (e.type) {
                        case MessagingServerStatusEventName.Ready:
                            return [createActionMessagingServerStateChanged(ServerState.Ready)]
                        case MessagingServerStatusEventName.Stopped:
                            return [createActionMessagingServerStateChanged(ServerState.StandBy)]
                        case MessagingServerStatusEventName.ConnectionAccepted:
                            return [
                                createActionMessagingServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Accepted
                                ),
                            ]
                        case MessagingServerStatusEventName.ConnectionReady:
                            return [
                                createActionMessagingServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Ready
                                ),
                            ]
                        case MessagingServerStatusEventName.ConnectionClosed:
                            return [
                                createActionMessagingServerConnectionStateChanged(
                                    e.connectionId,
                                    ServerConnectionState.Closed
                                ),
                            ]
                    }
                    return []
                })
            )
        }),
        catchError((err) => [createActionMessagingServerErrored(err)])
    )

const messagingServerStopRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return SampleMessagingServer.stop().pipe(
                switchMap(() => {
                    return []
                })
            )
        }),
        catchError((err) => [createActionMessagingServerErrored(err)])
    )

const messagingServerSendDataRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_SEND_MESSAGE_REQUESTED),
        switchMap((action) => {
            const data = action.payload.data
            const connectionId = action.payload.connectionId
            const message = createMessageTextMessageSent(data)
            return SampleMessagingServer.send(message, connectionId).pipe(
                switchMap(() => [
                    createActionMessagingServerDataReceived(connectionId, createMessageData("server", data)),
                ])
            )
        })
    )

export default [messagingServerStartRequested, messagingServerStopRequested, messagingServerSendDataRequested]
