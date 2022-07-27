import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import {
    BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED,
    BARE_TCP_SERVER_DATA_SEND_REQUESTED,
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
    createActionBareTcpServerConnectionNewData,
    createActionBareTcpServerConnectionStateChanged,
    createActionBareTcpServerErrored,
    createActionBareTcpServerReady,
    createActionBareTcpServerStartFailed,
    createActionBareTcpServerStartSucceeded,
    createActionBareTcpServerStopped,
} from "./actions"
import { catchError, filter, mapTo, switchMap } from "rxjs/operators"
import { defer } from "rxjs"
import { BareTCPServer } from "./network"
import {
    TCPServer,
    TCPServerConfiguration,
    TCPServerConnectionAcceptedNativeEvent,
    TCPServerConnectionClosedNativeEvent,
    TCPServerConnectionReadyNativeEvent,
    TCPServerDataReceivedNativeEvent,
    TCPServerReadyNativeEvent,
    TCPServerStoppedNativeEvent,
} from "@figuredev/react-native-local-server"
import { fromEventFixed } from "../../common/utils"
import { createMessageData } from "../../common/components/messaging/functions"
import { ServerConnectionState } from "../../common/types"

const bareTcpServerStartRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionBareTcpServerStartFailed("Invalid Port")]
            }
            const serverConfig: TCPServerConfiguration = {
                port: port,
            }
            return defer(() => BareTCPServer.start(serverConfig)).pipe(
                mapTo(createActionBareTcpServerStartSucceeded()),
                catchError((err) => [createActionBareTcpServerStartFailed(err)])
            )
        })
    )

const bareTcpServerReadyEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.Ready).pipe(
        filter((event: TCPServerReadyNativeEvent) => event.serverId === BareTCPServer.getId()),
        mapTo(createActionBareTcpServerReady())
    )

const bareTcpServerStoppedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.Stopped).pipe(
        filter((event: TCPServerStoppedNativeEvent) => event.serverId === BareTCPServer.getId()),
        mapTo(createActionBareTcpServerStopped(null))
    )

const bareTcpServerStopRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareTCPServer.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpServerErrored(err)])
            )
        })
    )

const bareTcpServerConnectionAcceptedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionAccepted).pipe(
        filter((event: TCPServerConnectionAcceptedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionAcceptedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Accepted),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "ACCEPTED")),
        ])
    )

const bareTcpServerConnectionReadyEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionReady).pipe(
        filter((event: TCPServerConnectionReadyNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionReadyNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Ready),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "READY")),
        ])
    )

const bareTcpServerConnectionStoppedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionClosed).pipe(
        filter((event: TCPServerConnectionClosedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionClosedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Closed),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "CLOSED")),
        ])
    )

const bareTcpServerDataReceivedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.DataReceived).pipe(
        filter((event: TCPServerDataReceivedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerDataReceivedNativeEvent) => [
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("client", event.data)),
        ])
    )

const bareTcpServerCloseConnectionRequested: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED),
        switchMap((action) => {
            const connectionId = action.payload.connectionId
            return defer(() => BareTCPServer.closeConnection(connectionId)).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpServerErrored(err)])
            )
        })
    )

const bareTcpServerDataSendRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_DATA_SEND_REQUESTED),
        switchMap((action) => {
            const connectionId = action.payload.connectionId
            const data = action.payload.data
            return defer(() => BareTCPServer.sendData(connectionId, data)).pipe(
                switchMap(() => [
                    createActionBareTcpServerConnectionNewData(connectionId, createMessageData("server", data)),
                ]),
                catchError((err) => [createActionBareTcpServerErrored(err)])
            )
        })
    )

export default [
    bareTcpServerStartRequestedEpic,
    bareTcpServerReadyEpic,
    bareTcpServerStoppedEpic,
    bareTcpServerStopRequestedEpic,
    bareTcpServerConnectionAcceptedEpic,
    bareTcpServerConnectionReadyEpic,
    bareTcpServerConnectionStoppedEpic,
    bareTcpServerDataReceivedEpic,
    bareTcpServerCloseConnectionRequested,
    bareTcpServerDataSendRequestedEpic,
]
