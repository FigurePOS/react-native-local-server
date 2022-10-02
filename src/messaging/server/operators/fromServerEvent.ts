import { Observable } from "rxjs"
import { TCPServer, TCPServerEventName, TCPServerNativeEvent } from "../../../"
import { filter } from "rxjs/operators"
import { fromEventFixed } from "../../../utils/operators/fromEventFixed"

export const fromServerEvent = <T extends TCPServerEventName>(
    serverId: string,
    eventName: T
): Observable<Extract<TCPServerNativeEvent, { type: T }>> =>
    fromEventFixed<Extract<TCPServerNativeEvent, { type: T }>>(TCPServer.EventEmitter, eventName).pipe(
        filter((event: Extract<TCPServerNativeEvent, { type: T }>): boolean => event.serverId === serverId)
    )
