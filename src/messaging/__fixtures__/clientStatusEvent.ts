import { MessagingClientStatusEvent, MessagingClientStatusEventName } from "../index"

export const MessagingClientStatusEventReady: MessagingClientStatusEvent = {
    type: MessagingClientStatusEventName.Ready,
}

export const MessagingClientStatusEventStopped: MessagingClientStatusEvent = {
    type: MessagingClientStatusEventName.Stopped,
}

export const MessagingClientStatusEventUnknown: MessagingClientStatusEvent = {
    type: MessagingClientStatusEventName.Unknown,
}
