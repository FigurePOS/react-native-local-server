import { Observable } from "rxjs"

import { TCPClientEventName, TCPClientNativeEvent } from "../nativeEvents"
import { TCPClientModule } from "../module"

const emitterMap = {
    [TCPClientEventName.Ready]: (handler: (event: unknown) => void) => TCPClientModule.onReady(handler),
    [TCPClientEventName.Stopped]: (handler: (event: unknown) => void) => TCPClientModule.onStopped(handler),
    [TCPClientEventName.DataReceived]: (handler: (event: unknown) => void) =>
        TCPClientModule.onDataReceived(handler),
}

export const fromTCPClientEvent = <T extends TCPClientEventName>(
    clientId: string,
    eventName: T,
): Observable<Extract<TCPClientNativeEvent, { type: T }>> =>
    new Observable((subscriber) => {
        const emitter = emitterMap[eventName]
        const subscription = emitter((event: unknown) => {
            const e = event as Record<string, unknown>
            if (e.clientId === clientId) {
                subscriber.next(e as Extract<TCPClientNativeEvent, { type: T }>)
            }
        })
        return () => subscription.remove()
    })
