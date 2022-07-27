import {
    MessagingClientStatusEvent,
    MessagingClientStatusEventName,
    MessagingClientLifecycleStatusEvent,
    TCPClientEventName,
    TCPClientNativeEvent,
} from "../../"

export const composeMessagingClientLifecycleStatusEvent = (
    type: MessagingClientLifecycleStatusEvent["type"]
): MessagingClientLifecycleStatusEvent => ({
    type: type,
})

export const composeMessagingClientStatusEvent = (nativeEvent: TCPClientNativeEvent): MessagingClientStatusEvent => {
    switch (nativeEvent.type) {
        case TCPClientEventName.Ready:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Ready)
        case TCPClientEventName.Stopped:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Stopped)
        default:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Unknown)
    }
}
