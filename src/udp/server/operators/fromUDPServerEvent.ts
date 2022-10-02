import { Observable } from "rxjs"
import { UDPServer, UDPServerEventName, UDPServerNativeEvent } from "../"
import { filter } from "rxjs/operators"
import { fromEventFixed } from "../../../utils/operators/fromEventFixed"

export const fromUDPServerEvent = <T extends UDPServerEventName>(
    serverId: string,
    eventName: T
): Observable<Extract<UDPServerNativeEvent, { type: T }>> =>
    fromEventFixed<Extract<UDPServerNativeEvent, { type: T }>>(UDPServer.EventEmitter, eventName).pipe(
        filter((event: Extract<UDPServerNativeEvent, { type: T }>): boolean => event.serverId === serverId)
    )
