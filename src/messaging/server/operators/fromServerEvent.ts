import { fromEvent, Observable } from "rxjs"
import { TCPServer, TCPServerEventName, TCPServerNativeEvent } from "../../../"
import { filter } from "rxjs/operators"

export const fromServerEvent = <T extends TCPServerEventName>(
    serverId: string,
    eventName: T
): Observable<Extract<TCPServerNativeEvent, { type: T }>> =>
    fromEvent<Extract<TCPServerNativeEvent, { type: T }>>(TCPServer.EventEmitter, eventName).pipe(
        filter((event: Extract<TCPServerNativeEvent, { type: T }>): boolean => event.serverId === serverId)
    )
