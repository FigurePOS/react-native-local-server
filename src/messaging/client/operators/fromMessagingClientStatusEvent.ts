import { merge, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { MessagingClientStatusEvent, TCPClient } from "../../../"
import { composeMessagingClientStatusEvent } from "../functions"
import { fromTCPClientEvent } from "../../../tcp/client/operators"

export const fromMessagingClientStatusEvent = (clientId: string): Observable<MessagingClientStatusEvent> =>
    merge(
        fromTCPClientEvent(clientId, TCPClient.EventName.Ready),
        fromTCPClientEvent(clientId, TCPClient.EventName.Stopped)
    ).pipe(map(composeMessagingClientStatusEvent))
