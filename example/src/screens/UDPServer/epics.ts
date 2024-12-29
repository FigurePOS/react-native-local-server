import { Epic, ofType } from "redux-observable"
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
import { catchError, filter, mapTo, switchMap } from "rxjs/operators"
import { defer, Observable } from "rxjs"
import { BareUDPServer } from "./network"
import {
    UDPServer,
    UDPServerConfiguration,
    UDPServerDataReceivedNativeEvent,
    UDPServerReadyNativeEvent,
    UDPServerStoppedNativeEvent,
} from "@figuredev/react-native-local-server"
import { fromEventFixed } from "../../common/utils"
import { createMessageData } from "../../common/components/messaging/functions"

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
                mapTo(createActionBareUdpServerStartSucceeded()),
                catchError((err) => [createActionBareUdpServerStartFailed(err)])
            )
        })
    )

const bareUdpServerReadyEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.Ready).pipe(
        filter((event: UDPServerReadyNativeEvent) => event.serverId === BareUDPServer.getId()),
        mapTo(createActionBareUdpServerReady())
    )

const bareUdpServerStoppedEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.Stopped).pipe(
        filter((event: UDPServerStoppedNativeEvent) => event.serverId === BareUDPServer.getId()),
        mapTo(createActionBareUdpServerStopped(null))
    )

const bareUdpServerStopRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_UDP_SERVER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareUDPServer.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionBareUdpServerErrored(err)])
            )
        })
    )

const bareUdpServerDataReceivedEpic: Epic = () =>
    fromEventFixed(UDPServer.EventEmitter, UDPServer.EventName.DataReceived).pipe(
        filter((event: UDPServerDataReceivedNativeEvent) => event.serverId === BareUDPServer.getId()),
        // TODO add more info about the data
        switchMap((event: UDPServerDataReceivedNativeEvent) => [
            createActionBareUdpServerDataReceived(createMessageData("client", event.data)),
        ])
    )

const bareUdpServerDataSendRequestedEpic: Epic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(BARE_UDP_SERVER_DATA_SEND_REQUESTED),
        switchMap((action: StateAction) => {
            const { host, port, data } = action.payload
            return defer(() => BareUDPServer.sendData(host, port, data)).pipe(
                switchMap(() => [createActionBareUdpServerDataReceived(createMessageData("server", data))]),
                catchError((err) => [createActionBareUdpServerErrored(err)])
            )
        })
    )

export default [
    bareUdpServerStartRequestedEpic,
    bareUdpServerReadyEpic,
    bareUdpServerStoppedEpic,
    bareUdpServerStopRequestedEpic,
    bareUdpServerDataReceivedEpic,
    bareUdpServerDataSendRequestedEpic,
]
