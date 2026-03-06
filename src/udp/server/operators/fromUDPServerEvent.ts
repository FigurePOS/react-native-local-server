import { Observable } from "rxjs"

import { UDPServerEventName, UDPServerNativeEvent } from "../nativeEvents"
import { UDPServerModule } from "../module"

const emitterMap = {
    [UDPServerEventName.Ready]: (handler: (event: unknown) => void) => UDPServerModule.onReady(handler),
    [UDPServerEventName.Stopped]: (handler: (event: unknown) => void) => UDPServerModule.onStopped(handler),
    [UDPServerEventName.DataReceived]: (handler: (event: unknown) => void) =>
        UDPServerModule.onDataReceived(handler),
}

export const fromUDPServerEvent = <T extends UDPServerEventName>(
    serverId: string,
    eventName: T,
): Observable<Extract<UDPServerNativeEvent, { type: T }>> =>
    new Observable((subscriber) => {
        const emitter = emitterMap[eventName]
        const subscription = emitter((event: unknown) => {
            const e = event as Record<string, unknown>
            if (e.serverId === serverId) {
                subscriber.next(e as Extract<UDPServerNativeEvent, { type: T }>)
            }
        })
        return () => subscription.remove()
    })
