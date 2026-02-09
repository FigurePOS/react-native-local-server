import { Observable } from "rxjs"
import { switchMap, take } from "rxjs/operators"

import { MessagingServerStatusEventName } from "../"

import { fromMessagingServerStatusEvent } from "./fromMessagingServerStatusEvent"
import { ofMessagingServerStatusEvent } from "./ofMessagingServerStatusEvent"

export const waitForMessagingServerEvent =
    <T = any>(serverId: string, event: MessagingServerStatusEventName) =>
    (source$: Observable<T>) =>
        source$.pipe(
            switchMap(() => fromMessagingServerStatusEvent(serverId)),
            ofMessagingServerStatusEvent(event),
            take(1),
            switchMap(() => []),
        )

export const waitForMessagingServerStopped = (serverId: string) =>
    waitForMessagingServerEvent(serverId, MessagingServerStatusEventName.Stopped)
