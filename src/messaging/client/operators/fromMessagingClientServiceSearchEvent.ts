import { Observable } from "rxjs"
import { map, scan } from "rxjs/operators"
import {
    mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate,
    reduceMessagingClientServiceSearchEventUpdate,
} from "../functions"
import { fromMessagingClientServiceBrowserEvent } from "./fromMessagingClientServiceBrowserEvent"
import { MessagingClientServiceSearchEvent, MessagingClientServiceSearchUpdate } from "../types"

export const fromMessagingClientServiceSearchEvent = (
    clientId: string
): Observable<MessagingClientServiceSearchEvent> => {
    return fromMessagingClientServiceBrowserEvent(clientId).pipe(
        map(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate),
        scan(reduceMessagingClientServiceSearchEventUpdate, {
            services: [],
            update: { type: MessagingClientServiceSearchUpdate.Unknown },
        })
    )
}
