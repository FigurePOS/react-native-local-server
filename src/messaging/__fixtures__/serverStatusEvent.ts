import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../index"

export const MessagingServerStatusEventReady: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Ready,
}

export const MessagingServerStatusEventStopped: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Stopped,
}

export const MessagingServerStatusEventUnknown: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Unknown,
}

export const MessagingServerStatusEventConnectionAccepted: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.ConnectionAccepted,
    connectionId: "connection-1",
}

export const MessagingServerStatusEventConnectionReady: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.ConnectionReady,
    connectionId: "connection-1",
}

export const MessagingServerStatusEventConnectionClosed: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.ConnectionClosed,
    connectionId: "connection-1",
}
