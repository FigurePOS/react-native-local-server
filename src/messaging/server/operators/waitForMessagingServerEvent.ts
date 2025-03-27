import { switchMapTo, take } from "rxjs/operators"
import { fromMessagingServerStatusEvent } from "./fromMessagingServerStatusEvent"
import { ofMessagingServerStatusEvent } from "./ofMessagingServerStatusEvent"
import { MessagingServerStatusEventName } from "../"
import { Observable } from "rxjs"

export const waitForMessagingServerEvent =
    <T = any>(serverId: string, event: MessagingServerStatusEventName) =>
    (source$: Observable<T>) =>
        source$.pipe(
            switchMapTo(fromMessagingServerStatusEvent(serverId)),
            ofMessagingServerStatusEvent(event),
            take(1),
            switchMapTo([]),
        )

export const waitForMessagingServerStopped = (serverId: string) =>
    waitForMessagingServerEvent(serverId, MessagingServerStatusEventName.Stopped)
