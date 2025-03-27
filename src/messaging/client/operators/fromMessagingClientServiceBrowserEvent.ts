import { merge, Observable } from "rxjs"
import { fromServiceBrowserEvent, ServiceBrowser, ServiceBrowserNativeEvent } from "../../.."
import { getBrowserIdFromMessagingClientId } from "../functions"

export const fromMessagingClientServiceBrowserEvent = (clientId: string): Observable<ServiceBrowserNativeEvent> => {
    return merge(
        fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.Stopped),
        fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.Started),
        fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.ServiceFound),
        fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.ServiceLost),
    )
}
