import { Observable } from "rxjs"

import { TCPServerEventName, TCPServerNativeEvent } from "../nativeEvents"
import { TCPServerModule } from "../module"

const emitterMap = {
    [TCPServerEventName.Ready]: (handler: (event: unknown) => void) => TCPServerModule.onReady(handler),
    [TCPServerEventName.Stopped]: (handler: (event: unknown) => void) => TCPServerModule.onStopped(handler),
    [TCPServerEventName.ConnectionAccepted]: (handler: (event: unknown) => void) =>
        TCPServerModule.onConnectionAccepted(handler),
    [TCPServerEventName.ConnectionReady]: (handler: (event: unknown) => void) =>
        TCPServerModule.onConnectionReady(handler),
    [TCPServerEventName.ConnectionClosed]: (handler: (event: unknown) => void) =>
        TCPServerModule.onConnectionClosed(handler),
    [TCPServerEventName.DataReceived]: (handler: (event: unknown) => void) =>
        TCPServerModule.onDataReceived(handler),
}

export const fromTCPServerEvent = <T extends TCPServerEventName>(
    serverId: string,
    eventName: T,
): Observable<Extract<TCPServerNativeEvent, { type: T }>> =>
    new Observable((subscriber) => {
        const emitter = emitterMap[eventName]
        const subscription = emitter((event: unknown) => {
            const e = event as Record<string, unknown>
            if (e.serverId === serverId) {
                subscriber.next(e as Extract<TCPServerNativeEvent, { type: T }>)
            }
        })
        return () => subscription.remove()
    })
