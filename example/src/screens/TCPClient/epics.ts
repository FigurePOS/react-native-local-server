import { Epic, ofType } from "redux-observable"
import { defer, Observable } from "rxjs"
import { catchError, filter, switchMap } from "rxjs/operators"

import {
    TCPClient,
    TCPClientConfiguration,
    TCPClientConnectionMethod,
    TCPClientDataReceivedNativeEvent,
    TCPClientReadyNativeEvent,
    TCPClientStoppedNativeEvent,
} from "@figuredev/react-native-local-server"

import { createMessageData } from "../../common/components/messaging/functions"
import { ClientState } from "../../common/types"
import { fromEventFixed } from "../../common/utils"
import { StateAction } from "../../types"

import {
    BARE_TCP_CLIENT_DATA_SEND_REQUESTED,
    BARE_TCP_CLIENT_START_REQUESTED,
    BARE_TCP_CLIENT_STOP_REQUESTED,
    createActionBareTcpClientErrored,
    createActionBareTcpClientNewData,
    createActionBareTcpClientStateChanged,
} from "./actions"
import { BareTCPClient } from "./network"

const bareTCPClientStartRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_START_REQUESTED),
        switchMap((action: StateAction) => {
            const host = action.payload.host
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionBareTcpClientErrored("Invalid Port")]
            }
            const serverConfig: TCPClientConfiguration = {
                connection: {
                    method: TCPClientConnectionMethod.Raw,
                    port: port,
                    host: host,
                },
            }
            return defer(() => BareTCPClient.start(serverConfig)).pipe(
                switchMap(() => []),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionBareTcpClientErrored(message)]
                }),
            )
        }),
    )

const bareTCPClientReadyEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.Ready).pipe(
        filter((event: TCPClientReadyNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap(() => [
            createActionBareTcpClientStateChanged(ClientState.Ready),
            createActionBareTcpClientNewData(createMessageData("status", "READY")),
        ]),
    )

const bareTCPClientStoppedEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.Stopped).pipe(
        filter((event: TCPClientStoppedNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap(() => [
            createActionBareTcpClientStateChanged(ClientState.StandBy),
            createActionBareTcpClientNewData(createMessageData("status", "STOPPED")),
        ]),
    )

const bareTCPClientStopRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareTCPClient.stop()).pipe(
                switchMap(() => []),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionBareTcpClientErrored(message)]
                }),
            )
        }),
    )

const bareTCPClientDataReceivedEpic: Epic = () =>
    fromEventFixed(TCPClient.EventEmitter, TCPClient.EventName.DataReceived).pipe(
        filter((event: TCPClientDataReceivedNativeEvent) => event.clientId === BareTCPClient.getId()),
        switchMap((event: TCPClientDataReceivedNativeEvent) => [
            createActionBareTcpClientNewData(createMessageData("server", event.data)),
        ]),
    )

const bareTCPClientDataSendRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_TCP_CLIENT_DATA_SEND_REQUESTED),
        switchMap((action: StateAction) => {
            const data = action.payload.data
            return defer(() => BareTCPClient.sendData(data)).pipe(
                switchMap(() => [createActionBareTcpClientNewData(createMessageData("client", data))]),
                catchError((err: unknown) => {
                    const message = err instanceof Error ? err.message : String(err)
                    return [createActionBareTcpClientErrored(message)]
                }),
            )
        }),
    )

export default [
    bareTCPClientStartRequestedEpic,
    bareTCPClientReadyEpic,
    bareTCPClientStoppedEpic,
    bareTCPClientStopRequestedEpic,
    bareTCPClientDataReceivedEpic,
    bareTCPClientDataSendRequestedEpic,
]
