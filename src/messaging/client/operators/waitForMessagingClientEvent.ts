import { switchMapTo, take } from "rxjs/operators"
import { fromMessagingClientStatusEvent, ofMessagingClientStatusEvent } from "./"
import { MessagingClientStatusEventName } from "../"
import { Observable } from "rxjs"

export const waitForMessagingClientEvent =
    <T = any>(clientId: string, event: MessagingClientStatusEventName) =>
    (source$: Observable<T>) =>
        source$.pipe(
            switchMapTo(fromMessagingClientStatusEvent(clientId)),
            ofMessagingClientStatusEvent(event),
            take(1),
            switchMapTo([])
        )

export const waitForMessagingClientStopped = (clientId: string) =>
    waitForMessagingClientEvent(clientId, MessagingClientStatusEventName.Stopped)
