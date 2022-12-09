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
    reason?: StopReason
): MessagingServerLifecycleStatusEvent => ({
    type: type,
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingServerConnectionStatusEvent = (
    type: MessagingServerConnectionStatusEvent["type"],
    connectionId: string,
    reason?: StopReason
): MessagingServerConnectionStatusEvent => ({
    type: type,
    connectionId: connectionId,
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingServerStatusEvent = (nativeEvent: TCPServerNativeEvent): MessagingServerStatusEvent => {
    switch (nativeEvent.type) {
        case TCPServerEventName.Ready:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Ready)
        case TCPServerEventName.Stopped:
            return composeMessagingServerLifecycleStatusEvent(
                MessagingServerStatusEventName.Stopped,
                nativeEvent.reason
            )
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
                nativeEvent.connectionId,
                nativeEvent.reason
            )
        default:
            return composeMessagingServerLifecycleStatusEvent(MessagingServerStatusEventName.Unknown)
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
