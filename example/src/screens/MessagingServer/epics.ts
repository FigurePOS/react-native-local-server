import { Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import { catchError, mergeMap, mergeMapTo, switchMap } from "rxjs/operators"
import {
    createActionMessagingServerConnectionStateChanged,
    createActionMessagingServerDataReceived,
    createActionMessagingServerErrored,
    createActionMessagingServerStateChanged,
    MESSAGING_SERVER_CONNECTION_CLOSE_REQUESTED,
    MESSAGING_SERVER_SEND_MESSAGE_REQUESTED,
    MESSAGING_SERVER_START_REQUESTED,
    MESSAGING_SERVER_STOP_REQUESTED,
} from "./actions"
import { SampleMessagingServer } from "./localCommunication/server"
import { rootHandler } from "./localCommunication/rootHandler"
import { SampleMessagingServerDependencies } from "./localCommunication/deps"
import { ServerConnectionState, ServerState } from "../../common/types"
import { createMessageTextMessageSent } from "./localCommunication/messages"
import { createMessageData } from "../../common/components/messaging/functions"
import { MessagingServerConfiguration, MessagingServerStatusEventName } from "@figuredev/react-native-local-server"
import { Observable } from "rxjs"

const messagingServerStartRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_START_REQUESTED),
        mergeMap((action: StateAction) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionMessagingServerErrored("Invalid Port")]
            }
            const config: MessagingServerConfiguration = {
                name: "Sample Messaging Server",
                port: port,
            }
            return SampleMessagingServer.start(config, rootHandler, SampleMessagingServerDependencies).pipe(
                mergeMapTo([]),
                catchError((err) => [createActionMessagingServerErrored(err)])
            )
        })
    )

const messagingServerStatus: Epic = () =>
    SampleMessagingServer.getStatusEvent$().pipe(
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
                        createActionMessagingServerConnectionStateChanged(e.connectionId, ServerConnectionState.Ready),
                    ]
                case MessagingServerStatusEventName.ConnectionClosed:
                    return [
                        createActionMessagingServerConnectionStateChanged(e.connectionId, ServerConnectionState.Closed),
                    ]
            }
            return []
        })
    )

const messagingServerStopRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_STOP_REQUESTED),
        mergeMap(() => {
            return SampleMessagingServer.stop().pipe(
                mergeMapTo([]),
                catchError((err) => [createActionMessagingServerErrored(err)])
            )
        })
    )

const messagingServerSendDataRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_SEND_MESSAGE_REQUESTED),
        switchMap((action: StateAction) => {
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

const messagingServerCloseConnectionRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(MESSAGING_SERVER_CONNECTION_CLOSE_REQUESTED),
        switchMap((action: StateAction) => {
            const connectionId = action.payload.connectionId
            return SampleMessagingServer.closeConnection(connectionId).pipe(switchMap(() => []))
        })
    )

export default [
    messagingServerStartRequested,
    messagingServerStopRequested,
    messagingServerStatus,
    messagingServerSendDataRequested,
    messagingServerCloseConnectionRequested,
]
