import {
    MessagingServerConnectionStatusEvent,
    MessagingServerLifecycleStatusEvent,
    MessagingServerStatusEvent,
    MessagingServerStatusEventName,
} from "./types"
import { TCPServerEventName, TCPServerNativeEvent } from "../../tcp"

export const composeMessagingServerLifecycleStatusEvent = (
    type: MessagingServerLifecycleStatusEvent["type"]
): MessagingServerLifecycleStatusEvent => ({
    type: type,
})

export const composeMessagingServerConnectionStatusEvent = (
    type: MessagingServerConnectionStatusEvent["type"],
    connectionId: string
): MessagingServerConnectionStatusEvent => ({
    type: type,
    connectionId: connectionId,
})

export const composeMessagingServerStatusEvent = (nativeEvent: TCPServerNativeEvent): MessagingServerStatusEvent => {
    switch (nativeEvent.type) {
        case TCPServerEventName.Ready:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Ready)
        case TCPServerEventName.Stopped:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Stopped)
        case TCPServerEventName.ConnectionAccepted:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionAccepted,
                nativeEvent.connectionId
            )
        case TCPServerEventName.ConnectionReady:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionReady,
                nativeEvent.connectionId
            )
        case TCPServerEventName.ConnectionClosed:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionClosed,
                nativeEvent.connectionId
            )
        default:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Unknown)
    }
}
