import { Observable } from "rxjs"
import { switchMap, take } from "rxjs/operators"

import { MessagingClientStatusEventName } from "../"
import { LoggerWrapper } from "../../../utils/logger"

import { fromMessagingClientStatusEvent, ofMessagingClientStatusEvent } from "./"

export const waitForMessagingClientEvent =
    <T = unknown>(clientId: string, event: MessagingClientStatusEventName, logger: LoggerWrapper) =>
    (source$: Observable<T>) =>
        source$.pipe(
            switchMap(() => fromMessagingClientStatusEvent(clientId, logger)),
            ofMessagingClientStatusEvent(event),
            take(1),
            switchMap(() => []),
        )

export const waitForMessagingClientStopped = (clientId: string, logger: LoggerWrapper) =>
    waitForMessagingClientEvent(clientId, MessagingClientStatusEventName.Stopped, logger)
