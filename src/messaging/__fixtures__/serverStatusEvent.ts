import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../index"

export const MessagingServerStatusEventReady: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Ready,
    port: 1234,
}

export const MessagingServerStatusEventStopped: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Stopped,
    port: 1234,
}

export const MessagingServerStatusEventUnknown: MessagingServerStatusEvent = {
    type: MessagingServerStatusEventName.Unknown,
    port: 0,
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
