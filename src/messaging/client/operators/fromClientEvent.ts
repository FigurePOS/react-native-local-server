import { TCPClient, TCPClientEventName, TCPClientNativeEvent } from "../../../"
import { Observable } from "rxjs"
import { filter } from "rxjs/operators"
import { fromEventFixed } from "../../../utils/operators/fromEventFixed"

export const fromClientEvent = <T extends TCPClientEventName>(
    clientId: string,
    eventName: T
): Observable<Extract<TCPClientNativeEvent, { type: T }>> =>
    fromEventFixed<Extract<TCPClientNativeEvent, { type: T }>>(TCPClient.EventEmitter, eventName).pipe(
        filter((event: Extract<TCPClientNativeEvent, { type: T }>): boolean => event.clientId === clientId)
    )
