import { Observable } from "rxjs"
import { filter } from "rxjs/operators"
import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../types"

export const ofServerStatusEvent =
    <T extends MessagingServerStatusEventName>(...types: T[]) =>
    (source$: Observable<MessagingServerStatusEvent>): Observable<Extract<MessagingServerStatusEvent, { type: T }>> =>
        // @ts-ignore
        source$.pipe(filter((e: MessagingServerStatusEvent): boolean => types.includes(e.type)))
