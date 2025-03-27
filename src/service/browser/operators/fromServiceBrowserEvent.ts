import { Observable } from "rxjs"
import { filter } from "rxjs/operators"
import { ServiceBrowser, ServiceBrowserEventName, ServiceBrowserNativeEvent } from "../"
import { fromEventFixed } from "../../../utils/operators/fromEventFixed"

export const fromServiceBrowserEvent = <T extends ServiceBrowserEventName>(
    browserId: string,
    eventName: T,
): Observable<Extract<ServiceBrowserNativeEvent, { type: T }>> =>
    fromEventFixed<Extract<ServiceBrowserNativeEvent, { type: T }>>(ServiceBrowser.EventEmitter, eventName).pipe(
        filter((event: Extract<ServiceBrowserNativeEvent, { type: T }>): boolean => event.browserId === browserId),
    )
