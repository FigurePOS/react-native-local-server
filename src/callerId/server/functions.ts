import { CallerIdServerStatusEvent, CallerIdServerStatusEventName } from "./types"
import { UDPServer, UDPServerNativeEvent } from "../../udp"

export const composeCallerIdServerStatusEvent = (nativeEvent: UDPServerNativeEvent): CallerIdServerStatusEvent => {
    switch (nativeEvent.type) {
        case UDPServer.EventName.Ready:
            return {
                type: CallerIdServerStatusEventName.Ready,
            }
        case UDPServer.EventName.Stopped:
            return {
                type: CallerIdServerStatusEventName.Stopped,
                ...(nativeEvent.reason ? { reason: nativeEvent.reason } : null),
            }
        default:
            return {
                type: CallerIdServerStatusEventName.Unknown,
            }
    }
}
