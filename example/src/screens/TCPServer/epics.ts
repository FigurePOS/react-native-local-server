import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import {
    BARE_TCP_SERVER_DATA_SEND_REQUESTED,
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
    createActionBareTcpServerConnectionNewData,
    createActionBareTcpServerConnectionStateChanged,
    createActionBareTcpServerReady,
    createActionBareTcpServerStartErrored,
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
} from "react-native-local-server"
import { fromEventFixed } from "../../common/utils"
import { TCPServerConnectionState } from "./types"
import { createTCPServerConnectionData } from "./functions"

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
                catchError((err) => [createActionBareTcpServerStartErrored(err)])
            )
        })
    )

const bareTcpServerConnectionAcceptedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionAccepted).pipe(
        filter((event: TCPServerConnectionAcceptedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionAcceptedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, TCPServerConnectionState.Accepted),
            createActionBareTcpServerConnectionNewData(
                event.connectionId,
                createTCPServerConnectionData("status", "ACCEPTED")
            ),
        ])
    )

const bareTcpServerConnectionReadyEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionReady).pipe(
        filter((event: TCPServerConnectionReadyNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionReadyNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, TCPServerConnectionState.Ready),
            createActionBareTcpServerConnectionNewData(
                event.connectionId,
                createTCPServerConnectionData("status", "READY")
            ),
        ])
    )

const bareTcpServerConnectionStoppedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionClosed).pipe(
        filter((event: TCPServerConnectionClosedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionClosedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, TCPServerConnectionState.Closed),
            createActionBareTcpServerConnectionNewData(
                event.connectionId,
                createTCPServerConnectionData("status", "CLOSED")
            ),
        ])
    )

const bareTcpServerDataReceivedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.DataReceived).pipe(
        filter((event: TCPServerDataReceivedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerDataReceivedNativeEvent) => [
            createActionBareTcpServerConnectionNewData(
                event.connectionId,
                createTCPServerConnectionData("client", event.data)
            ),
        ])
    )

const bareTcpServerDataSendRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_DATA_SEND_REQUESTED),
        switchMap((action) => {
            const connectionId = action.payload.connectionId
            const data = action.payload.data
            return defer(() => BareTCPServer.sendData(connectionId, data)).pipe(
                switchMap(() => [
                    createActionBareTcpServerConnectionNewData(
                        connectionId,
                        createTCPServerConnectionData("server", data)
                    ),
                ]),
                catchError((err) => [createActionBareTcpServerStartErrored(err)])
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
    bareTcpServerDataSendRequestedEpic,
]
