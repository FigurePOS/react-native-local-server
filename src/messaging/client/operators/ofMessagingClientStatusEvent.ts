import { Observable } from "rxjs"
import { filter } from "rxjs/operators"
import { MessagingClientStatusEvent, MessagingClientStatusEventName } from "../types"

export const ofMessagingClientStatusEvent =
    <T extends MessagingClientStatusEventName>(...types: T[]) =>
    (source$: Observable<MessagingClientStatusEvent>): Observable<Extract<MessagingClientStatusEvent, { type: T }>> =>
        // @ts-ignore
        source$.pipe(filter((e: MessagingClientStatusEvent): boolean => types.includes(e.type)))
