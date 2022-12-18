import {
    MessagingClientConfiguration,
    MessagingClientConnectionMethod,
    MessagingClientLifecycleStatusEvent,
    MessagingClientServiceSearchEvent,
    MessagingClientServiceSearchEventUpdate,
    MessagingClientServiceSearchResult,
    MessagingClientServiceSearchUpdate,
    MessagingClientStatusEvent,
    MessagingClientStatusEventName,
    ServiceBrowserEventName,
    ServiceBrowserNativeEvent,
    StopReason,
    TCPClientConfiguration,
    TCPClientConnectionMethod,
    TCPClientEventName,
    TCPClientNativeEvent,
} from "../../"
import { DataObjectServiceInfo } from "../types"

export const composeMessagingClientLifecycleStatusEvent = (
    type: MessagingClientLifecycleStatusEvent["type"],
    reason?: StopReason
): MessagingClientLifecycleStatusEvent => ({
    type: type,
    ...(reason ? { reason: reason } : null),
})

export const composeMessagingClientServiceInformationStatusEvent = (
    data: DataObjectServiceInfo
): MessagingClientStatusEvent => ({
    type: MessagingClientStatusEventName.ServiceInformationChanged,
    info: data.info,
})

export const composeMessagingClientStatusEvent = (
    nativeEvent: TCPClientNativeEvent | ServiceBrowserNativeEvent
): MessagingClientStatusEvent => {
    switch (nativeEvent.type) {
        case TCPClientEventName.Ready:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Ready)
        case TCPClientEventName.Stopped:
            return composeMessagingClientLifecycleStatusEvent(
                MessagingClientStatusEventName.Stopped,
                nativeEvent.reason
            )
        case ServiceBrowserEventName.Started:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.ServiceSearchStarted)
        case ServiceBrowserEventName.Stopped:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.ServiceSearchStopped)
        default:
            return composeMessagingClientLifecycleStatusEvent(MessagingClientStatusEventName.Unknown)
    }
}

export const getBrowserIdFromMessagingClientId = (clientId: string): string => `${clientId}__service_browser`

export const mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate = (
    event: ServiceBrowserNativeEvent
): MessagingClientServiceSearchEventUpdate => {
    const service = mapServiceBrowserEventToMessagingService(event)
    switch (event.type) {
        case ServiceBrowserEventName.ServiceFound:
            return {
                type: MessagingClientServiceSearchUpdate.ServiceFound,
                service: service!,
            }
        case ServiceBrowserEventName.ServiceLost:
            return {
                type: MessagingClientServiceSearchUpdate.ServiceLost,
                service: service!,
            }
        case ServiceBrowserEventName.Started:
        case ServiceBrowserEventName.Stopped:
            return { type: MessagingClientServiceSearchUpdate.Reset }
        default:
            return { type: MessagingClientServiceSearchUpdate.Unknown }
    }
}

export const mapServiceBrowserEventToMessagingService = (
    event: ServiceBrowserNativeEvent
): MessagingClientServiceSearchResult | null => {
    if (event.type === ServiceBrowserEventName.ServiceFound || event.type === ServiceBrowserEventName.ServiceLost) {
        return parseMessagingServiceInformation(event.name)
    }
    return null
}

export const parseMessagingServiceInformation = (text: string): MessagingClientServiceSearchResult => {
    const regex = /^(.*)\((.*)\)$/
    const match = text.trim().match(regex)
    if (!match) {
        return {
            name: text.trim(),
            shortId: "",
        }
    }
    return {
        name: match[1].trim(),
        shortId: match[2].trim(),
    }
}

export const reduceMessagingClientServiceSearchEventUpdate = (
    current: MessagingClientServiceSearchEvent,
    update: MessagingClientServiceSearchEventUpdate
): MessagingClientServiceSearchEvent => {
    switch (update.type) {
        case MessagingClientServiceSearchUpdate.ServiceFound:
            return {
                ...current,
                services: current.services.find((s) => s.shortId === update.service.shortId)
                    ? current.services
                    : [...current.services, update.service],
                update: update,
            }
        case MessagingClientServiceSearchUpdate.ServiceLost:
            return {
                ...current,
                services: current.services.filter((service) => service.shortId !== update.service.shortId),
                update: update,
            }
        case MessagingClientServiceSearchUpdate.Reset:
            return {
                ...current,
                services: [],
                update: update,
            }
        default:
            return {
                ...current,
                update: update,
            }
    }
}

export const composeTCPClientConfiguration = (
    config: MessagingClientConfiguration,
    discoveryGroup: string | null
): TCPClientConfiguration | null => {
    switch (config.connection.method) {
        case MessagingClientConnectionMethod.Raw:
            return {
                connection: {
                    method: TCPClientConnectionMethod.Raw,
                    host: config.connection.host,
                    port: config.connection.port,
                },
            }
        case MessagingClientConnectionMethod.Service:
            return discoveryGroup
                ? {
                      connection: {
                          method: TCPClientConnectionMethod.Discovery,
                          group: discoveryGroup,
                          name: `${config.connection.service.name} (${config.connection.service.shortId})`,
                      },
                  }
                : null
        default:
            return null
    }
}
