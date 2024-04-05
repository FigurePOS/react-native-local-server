import { switchMapTo, take } from "rxjs/operators"
import { fromMessagingClientStatusEvent, ofMessagingClientStatusEvent } from "./"
import { MessagingClientStatusEventName } from "../"
import { Observable } from "rxjs"
import { LoggerWrapper } from "../../../utils/logger"

export const waitForMessagingClientEvent =
    <T = any>(clientId: string, event: MessagingClientStatusEventName, logger: LoggerWrapper) =>
    (source$: Observable<T>) =>
        source$.pipe(
            switchMapTo(fromMessagingClientStatusEvent(clientId, logger)),
            ofMessagingClientStatusEvent(event),
            take(1),
            switchMapTo([])
        )

export const waitForMessagingClientStopped = (clientId: string, logger: LoggerWrapper) =>
    waitForMessagingClientEvent(clientId, MessagingClientStatusEventName.Stopped, logger)
