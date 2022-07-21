import { merge, Observable } from "rxjs"
import { fromServerEvent } from "./fromServerEvent"
import { TCPServer } from "react-native-local-server"
import { map } from "rxjs/operators"
import { composeMessagingServerStatusEvent } from "../functions"
import { MessagingServerStatusEvent } from "../types"

export const fromServerStatusEvent = (serverId: string): Observable<MessagingServerStatusEvent> =>
    merge(
        fromServerEvent(serverId, TCPServer.EventName.Ready),
        fromServerEvent(serverId, TCPServer.EventName.Stopped),
        fromServerEvent(serverId, TCPServer.EventName.ConnectionAccepted),
        fromServerEvent(serverId, TCPServer.EventName.ConnectionReady),
        fromServerEvent(serverId, TCPServer.EventName.ConnectionClosed)
    ).pipe(map(composeMessagingServerStatusEvent))
