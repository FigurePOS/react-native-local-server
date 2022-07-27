import { merge, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { MessagingClientStatusEvent, TCPClient } from "../../../"
import { fromClientEvent } from "./fromClientEvent"
import { composeMessagingClientStatusEvent } from "../functions"

export const fromClientStatusEvent = (clientId: string): Observable<MessagingClientStatusEvent> =>
    merge(
        fromClientEvent(clientId, TCPClient.EventName.Ready),
        fromClientEvent(clientId, TCPClient.EventName.Stopped)
    ).pipe(map(composeMessagingClientStatusEvent))
