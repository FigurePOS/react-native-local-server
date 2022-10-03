import { merge, Observable } from "rxjs"
import { TCPServer } from "../../../"
import { map } from "rxjs/operators"
import { composeMessagingServerStatusEvent } from "../functions"
import { MessagingServerStatusEvent } from "../types"
import { fromTCPServerEvent } from "../../../tcp/server/operators"

export const fromMessagingServerStatusEvent = (serverId: string): Observable<MessagingServerStatusEvent> =>
    merge(
        fromTCPServerEvent(serverId, TCPServer.EventName.Ready),
        fromTCPServerEvent(serverId, TCPServer.EventName.Stopped),
        fromTCPServerEvent(serverId, TCPServer.EventName.ConnectionAccepted),
        fromTCPServerEvent(serverId, TCPServer.EventName.ConnectionReady),
        fromTCPServerEvent(serverId, TCPServer.EventName.ConnectionClosed)
    ).pipe(map(composeMessagingServerStatusEvent))
