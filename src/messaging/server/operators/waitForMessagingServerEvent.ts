import { Observable } from "rxjs"
import { switchMapTo, take } from "rxjs/operators"

import { MessagingServerStatusEventName } from "../"

import { fromMessagingServerStatusEvent } from "./fromMessagingServerStatusEvent"
import { ofMessagingServerStatusEvent } from "./ofMessagingServerStatusEvent"

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
