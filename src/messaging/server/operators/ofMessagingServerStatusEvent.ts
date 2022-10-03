import { Observable } from "rxjs"
import { filter } from "rxjs/operators"
import {
    MessagingServerConnectionStatusEvent,
    MessagingServerStatusEvent,
    MessagingServerStatusEventName,
} from "../types"

export const ofMessagingServerStatusEvent =
    <T extends MessagingServerStatusEventName>(...types: T[]) =>
    (source$: Observable<MessagingServerStatusEvent>): Observable<Extract<MessagingServerStatusEvent, { type: T }>> =>
        // @ts-ignore
        source$.pipe(filter((e: MessagingServerStatusEvent): boolean => types.includes(e.type)))

export const ofMessagingServerConnectionClosed =
    (connectionId: string) =>
    (source$: Observable<MessagingServerStatusEvent>): Observable<MessagingServerConnectionStatusEvent> =>
        source$.pipe(
            ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionClosed),
            filter((e: MessagingServerConnectionStatusEvent) => e.connectionId === connectionId)
        )
