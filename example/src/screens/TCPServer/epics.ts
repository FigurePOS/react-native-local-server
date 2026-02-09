import { Epic, ofType } from "redux-observable"
import { defer, Observable } from "rxjs"
import { catchError, filter, map, switchMap } from "rxjs/operators"

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

import { createMessageData } from "../../common/components/messaging/functions"
import { ServerConnectionState } from "../../common/types"
import { fromEventFixed } from "../../common/utils"
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
import { BareTCPServer } from "./network"

const bareTcpServerStartRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = action.payload.port
            const parsedPort = Number.parseInt(port, 10)
            const isPortValid = port.length === 0 || !Number.isNaN(parsedPort)
            if (!isPortValid) {
                return [createActionBareTcpServerStartFailed("Invalid Port")]
            }
            const serverConfig: TCPServerConfiguration = {
                port: port.length === 0 ? null : parsedPort,
            }
            return defer(() => BareTCPServer.start(serverConfig)).pipe(
                map(() => createActionBareTcpServerStartSucceeded()),
                catchError((err) => [createActionBareTcpServerStartFailed(err)]),
            )
        }),
    )

const bareTcpServerReadyEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.Ready).pipe(
        filter((event: TCPServerReadyNativeEvent) => event.serverId === BareTCPServer.getId()),
        map((event: TCPServerReadyNativeEvent) => createActionBareTcpServerReady(Number.parseInt(event.port, 10))),
    )

const bareTcpServerStoppedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.Stopped).pipe(
        filter((event: TCPServerStoppedNativeEvent) => event.serverId === BareTCPServer.getId()),
        map(() => createActionBareTcpServerStopped(null)),
    )

const bareTcpServerStopRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareTCPServer.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpServerErrored(err)]),
            )
        }),
    )

const bareTcpServerConnectionAcceptedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionAccepted).pipe(
        filter((event: TCPServerConnectionAcceptedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionAcceptedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Accepted),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "ACCEPTED")),
        ]),
    )

const bareTcpServerConnectionReadyEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionReady).pipe(
        filter((event: TCPServerConnectionReadyNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionReadyNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Ready),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "READY")),
        ]),
    )

const bareTcpServerConnectionStoppedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.ConnectionClosed).pipe(
        filter((event: TCPServerConnectionClosedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerConnectionClosedNativeEvent) => [
            createActionBareTcpServerConnectionStateChanged(event.connectionId, ServerConnectionState.Closed),
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("status", "CLOSED")),
        ]),
    )

const bareTcpServerDataReceivedEpic: Epic = () =>
    fromEventFixed(TCPServer.EventEmitter, TCPServer.EventName.DataReceived).pipe(
        filter((event: TCPServerDataReceivedNativeEvent) => event.serverId === BareTCPServer.getId()),
        switchMap((event: TCPServerDataReceivedNativeEvent) => [
            createActionBareTcpServerConnectionNewData(event.connectionId, createMessageData("client", event.data)),
        ]),
    )

const bareTcpServerCloseConnectionRequested: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED),
        switchMap((action: StateAction) => {
            const connectionId = action.payload.connectionId
            return defer(() => BareTCPServer.closeConnection(connectionId)).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpServerErrored(err)]),
            )
        }),
    )

const bareTcpServerDataSendRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_SERVER_DATA_SEND_REQUESTED),
        switchMap((action: StateAction) => {
            const connectionId = action.payload.connectionId
            const data = action.payload.data
            return defer(() => BareTCPServer.sendData(connectionId, data)).pipe(
                switchMap(() => [
                    createActionBareTcpServerConnectionNewData(connectionId, createMessageData("server", data)),
                ]),
                catchError((err) => [createActionBareTcpServerErrored(err)]),
            )
        }),
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
