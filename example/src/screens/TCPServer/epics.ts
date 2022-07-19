import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import {
    BARE_TCP_SERVER_START_REQUESTED,
    BARE_TCP_SERVER_STOP_REQUESTED,
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
    TCPServerReadyNativeEvent,
    TCPServerStoppedNativeEvent,
} from "react-native-local-server"
import { fromEventFixed } from "../../common/utils"

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

export default [
    bareTcpServerStartRequestedEpic,
    bareTcpServerReadyEpic,
    bareTcpServerStoppedEpic,
    bareTcpServerStopRequestedEpic,
]
