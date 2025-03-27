import {
    MessagingServerConfiguration,
    MessagingServerConnectionStatusEvent,
    MessagingServerLifecycleStatusEvent,
    MessagingServerStatusEvent,
    MessagingServerStatusEventName,
} from "./types"
import { TCPServerConfiguration, TCPServerEventName, TCPServerNativeEvent } from "../../tcp"
import { StopReason } from "../../utils/types"
import { getShortServiceId } from "../functions/composeDataServiceInfoObject"

export const composeMessagingServerLifecycleStatusEvent = (
    type: MessagingServerLifecycleStatusEvent["type"],
    port: string,
    reason?: StopReason,
): MessagingServerLifecycleStatusEvent => ({
    type: type,
    port: Number.parseInt(port, 10),
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingServerConnectionStatusEvent = (
    type: MessagingServerConnectionStatusEvent["type"],
    connectionId: string,
    reason?: StopReason,
): MessagingServerConnectionStatusEvent => ({
    type: type,
    connectionId: connectionId,
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingServerStatusEvent = (nativeEvent: TCPServerNativeEvent): MessagingServerStatusEvent => {
    switch (nativeEvent.type) {
        case TCPServerEventName.Ready:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Ready, nativeEvent.port)
        case TCPServerEventName.Stopped:
            return composeMessagingServerLifecycleStatusEvent(
                MessagingServerStatusEventName.Stopped,
                nativeEvent.port,
                nativeEvent.reason,
            )
        case TCPServerEventName.ConnectionAccepted:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionAccepted,
                nativeEvent.connectionId,
            )
        case TCPServerEventName.ConnectionReady:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionReady,
                nativeEvent.connectionId,
            )
        case TCPServerEventName.ConnectionClosed:
            return composeMessagingServerConnectionStatusEvent(
                MessagingServerStatusEventName.ConnectionClosed,
                nativeEvent.connectionId,
                nativeEvent.reason,
            )
        default:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Unknown, "0")
    }
}

export const composeTCPServerConfiguration = (config: MessagingServerConfiguration): TCPServerConfiguration => ({
    port: config.port,
    ...(config.discovery
        ? {
              discovery: {
                  group: config.discovery.group,
                  name: getDiscoveryNameFromConfiguration(config),
              },
          }
        : null),
})

export const getDiscoveryNameFromConfiguration = (config: MessagingServerConfiguration): string => {
    if (config.discovery?.name) {
        return config.discovery.name
    }
    if (config.service?.name && config.service?.id) {
        return `${config.service.name} (${getShortServiceId(config.service.id)})`
    }
    return "UNKNOWN"
}
