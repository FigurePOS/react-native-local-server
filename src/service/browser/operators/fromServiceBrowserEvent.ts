import { Observable } from "rxjs"

import { ServiceBrowserEventName, ServiceBrowserNativeEvent } from "../nativeEvents"
import { ServiceBrowserModule } from "../module"

const emitterMap = {
    [ServiceBrowserEventName.Started]: (handler: (event: unknown) => void) =>
        ServiceBrowserModule.onStarted(handler),
    [ServiceBrowserEventName.Stopped]: (handler: (event: unknown) => void) =>
        ServiceBrowserModule.onStopped(handler),
    [ServiceBrowserEventName.ServiceFound]: (handler: (event: unknown) => void) =>
        ServiceBrowserModule.onServiceFound(handler),
    [ServiceBrowserEventName.ServiceLost]: (handler: (event: unknown) => void) =>
        ServiceBrowserModule.onServiceLost(handler),
}

export const fromServiceBrowserEvent = <T extends ServiceBrowserEventName>(
    browserId: string,
    eventName: T,
): Observable<Extract<ServiceBrowserNativeEvent, { type: T }>> =>
    new Observable((subscriber) => {
        const emitter = emitterMap[eventName]
        const subscription = emitter((event: unknown) => {
            const e = event as Record<string, unknown>
            if (e.browserId === browserId) {
                subscriber.next(e as Extract<ServiceBrowserNativeEvent, { type: T }>)
            }
        })
        return () => subscription.remove()
    })
