import { Epic, ofType } from "redux-observable"
import { defer, Observable } from "rxjs"
import { catchError, filter, map, switchMap } from "rxjs/operators"

import {
    UDPServer,
    UDPServerConfiguration,
    UDPServerDataReceivedNativeEvent,
    UDPServerReadyNativeEvent,
    UDPServerStoppedNativeEvent,
} from "@figuredev/react-native-local-server"

import { createMessageData } from "../../common/components/messaging/functions"
import { fromEventFixed } from "../../common/utils"
import { StateAction } from "../../types"

import {
    BARE_UDP_SERVER_DATA_SEND_REQUESTED,
    BARE_UDP_SERVER_START_REQUESTED,
    BARE_UDP_SERVER_STOP_REQUESTED,
    createActionBareUdpServerDataReceived,
    createActionBareUdpServerErrored,
    createActionBareUdpServerReady,
    createActionBareUdpServerStartFailed,
    createActionBareUdpServerStartSucceeded,
    createActionBareUdpServerStopped,
} from "./actions"
import { BareUDPServer } from "./network"

const bareUdpServerStartRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_UDP_SERVER_START_REQUESTED),
        switchMap((action: StateAction) => {
            const port = Number.parseInt(action.payload.port, 10)
            if (!port || Number.isNaN(port)) {
                return [createActionBareUdpServerStartFailed("Invalid Port")]
            }
            const serverConfig: UDPServerConfiguration = {
                port: port,
            }
            return defer(() => BareUDPServer.start(serverConfig)).pipe(
                map(() => createActionBareUdpServerStartSucceeded()),
                catchError((err: unknown) => [createActionBareUdpServerStartFailed(err)]),
            )
        }),
    )

const bareUdpServerReadyEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.Ready).pipe(
        filter((event: UDPServerReadyNativeEvent) => event.serverId === BareUDPServer.getId()),
        map(() => createActionBareUdpServerReady()),
    )

const bareUdpServerStoppedEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.Stopped).pipe(
        filter((event: UDPServerStoppedNativeEvent) => event.serverId === BareUDPServer.getId()),
        map(() => createActionBareUdpServerStopped(null)),
    )

const bareUdpServerStopRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_UDP_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareUDPServer.stop()).pipe(
                switchMap(() => []),
                catchError((err: unknown) => [createActionBareUdpServerErrored(err)]),
            )
        }),
    )

const bareUdpServerDataReceivedEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.DataReceived).pipe(
        filter((event: UDPServerDataReceivedNativeEvent) => event.serverId === BareUDPServer.getId()),
        // TODO add more info about the data
        switchMap((event: UDPServerDataReceivedNativeEvent) => [
            createActionBareUdpServerDataReceived(createMessageData("client", event.data)),
        ]),
    )

const bareUdpServerDataSendRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_UDP_SERVER_DATA_SEND_REQUESTED),
        switchMap((action: StateAction) => {
            const { host, port, data } = action.payload
            return defer(() => BareUDPServer.sendData(host, port, data)).pipe(
                switchMap(() => [createActionBareUdpServerDataReceived(createMessageData("server", data))]),
                catchError((err: unknown) => [createActionBareUdpServerErrored(err)]),
            )
        }),
    )

export default [
    bareUdpServerStartRequestedEpic,
    bareUdpServerReadyEpic,
    bareUdpServerStoppedEpic,
    bareUdpServerStopRequestedEpic,
    bareUdpServerDataReceivedEpic,
    bareUdpServerDataSendRequestedEpic,
]
