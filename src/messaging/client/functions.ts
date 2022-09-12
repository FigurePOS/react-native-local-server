import {
    MessagingClientLifecycleStatusEvent,
    MessagingClientStatusEvent,
    MessagingClientStatusEventName,
    StopReason,
    TCPClientEventName,
    TCPClientNativeEvent,
} from "../../"

export const composeMessagingClientLifecycleStatusEvent = (
    type: MessagingClientLifecycleStatusEvent["type"],
    reason?: StopReason
): MessagingClientLifecycleStatusEvent => ({
    type: type,
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingClientStatusEvent = (nativeEvent: TCPClientNativeEvent): MessagingClientStatusEvent => {
    switch (nativeEvent.type) {
        case TCPClientEventName.Ready:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Ready)
        case TCPClientEventName.Stopped:
            return composeMessagingClientLifecycleStatusEvent(
                MessagingClientStatusEventName.Stopped,
                nativeEvent.reason
            )
        default:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Unknown)
    }
}
