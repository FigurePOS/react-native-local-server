import { merge, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { CallerIdServerStatusEvent } from "../../"
import { fromUDPServerEvent, UDPServer } from "../../../udp"
import { composeCallerIdServerStatusEvent } from "../functions"

export const fromCallerIdServerStatusEvent = (serverId: string): Observable<CallerIdServerStatusEvent> =>
    merge(
        fromUDPServerEvent(serverId, UDPServer.EventName.Ready),
        fromUDPServerEvent(serverId, UDPServer.EventName.Stopped),
    ).pipe(map(composeCallerIdServerStatusEvent))
