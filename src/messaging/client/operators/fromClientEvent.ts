import { TCPClient, TCPClientEventName, TCPClientNativeEvent } from "../../../"
import { fromEvent, Observable } from "rxjs"
import { filter } from "rxjs/operators"

export const fromClientEvent = <T extends TCPClientEventName>(
    clientId: string,
    eventName: T
): Observable<Extract<TCPClientNativeEvent, { type: T }>> =>
    fromEvent<Extract<TCPClientNativeEvent, { type: T }>>(TCPClient.EventEmitter, eventName).pipe(
        filter((event: Extract<TCPClientNativeEvent, { type: T }>): boolean => event.clientId === clientId)
    )
