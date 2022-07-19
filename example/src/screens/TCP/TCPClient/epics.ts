import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../../types"
import { catchError, filter, switchMap } from "rxjs/operators"
import { defer } from "rxjs"
import { BareTCPClient } from "./network"
import {
    TCPClient,
    TCPClientConfiguration,
    TCPClientDataReceivedNativeEvent,
    TCPClientReadyNativeEvent,
    TCPClientStoppedNativeEvent,
} from "react-native-local-server"
import { fromEventFixed } from "../../../common/utils"
import { TCPClientState } from "../common/types"
import { createTCPRowData } from "../common/functions"
import {
    BARE_TCP_CLIENT_DATA_SEND_REQUESTED,
    BARE_TCP_CLIENT_START_REQUESTED,
    BARE_TCP_CLIENT_STOP_REQUESTED,
    createActionBareTcpClientErrored,
    createActionBareTcpClientNewData,
    createActionBareTcpClientStateChanged,
} from "./actions"

const bareTCPClientStartRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_START_REQUESTED),
        switchMap((action: StateAction) => {
            const host = action.payload.host
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionBareTcpClientErrored("Invalid Port")]
            }
            const serverConfig: TCPClientConfiguration = {
                port: port,
                host: host,
            }
            return defer(() => BareTCPClient.start(serverConfig)).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpClientErrored(err)])
            )
        })
    )

const bareTCPClientReadyEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.Ready).pipe(
        filter((event: TCPClientReadyNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap(() => [
            createActionBareTcpClientStateChanged(TCPClientState.Ready),
            createActionBareTcpClientNewData(createTCPRowData("status", "READY")),
        ])
    )

const bareTCPClientStoppedEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.Stopped).pipe(
        filter((event: TCPClientStoppedNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap(() => [
            createActionBareTcpClientStateChanged(TCPClientState.StandBy),
            createActionBareTcpClientNewData(createTCPRowData("status", "STOPPED")),
        ])
    )

const bareTCPClientStopRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareTCPClient.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareTcpClientErrored(err)])
            )
        })
    )

const bareTCPClientDataReceivedEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.DataReceived).pipe(
        filter((event: TCPClientDataReceivedNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap((event: TCPClientDataReceivedNativeEvent) => [
            createActionBareTcpClientNewData(createTCPRowData("server", event.data)),
        ])
    )

const bareTCPClientDataSendRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_DATA_SEND_REQUESTED),
        switchMap((action) => {
            const data = action.payload.data
            return defer(() => BareTCPClient.sendData(data)).pipe(
                switchMap(() => [createActionBareTcpClientNewData(createTCPRowData("client", data))]),
                catchError((err) => [createActionBareTcpClientErrored(err)])
            )
        })
    )

export default [
    bareTCPClientStartRequestedEpic,
    bareTCPClientReadyEpic,
    bareTCPClientStoppedEpic,
    bareTCPClientStopRequestedEpic,
    bareTCPClientDataReceivedEpic,
    bareTCPClientDataSendRequestedEpic,
]
