import { MessagingServiceInformation, MessagingStoppedReason } from "../types"

export const MESSAGING_CLIENT_DEFAULT_TIMEOUT = 10 * 1000

/**
 * Object containing configuration of messaging client
 * @property connection - connection configuration
 * @property name - name of the server
 * @property serviceId - public id of the client
 * @property ping - ping configuration of the client
 */
export type MessagingClientConfiguration = {
    connection: MessagingClientConnectionConfiguration
    name?: string
    serviceId?: string
    ping?: MessagingClientPingConfiguration
}

export enum MessagingClientConnectionMethod {
    Raw = "raw",
    Service = "service",
}

/**
 * Object containing connection configuration of messaging client
 * @property host - target host address
 * @property port - target port
 * @property timeout - timeout of the connection (defaults to MESSAGING_CLIENT_DEFAULT_TIMEOUT)
 */
export type MessagingClientConnectionMethodRaw = {
    method: MessagingClientConnectionMethod.Raw
    host: string
    port: number
    timeout?: number
}

/**
 * Object containing connection configuration of messaging client
 * @property service - target service
 * @property timeout - timeout of the connection (defaults to MESSAGING_CLIENT_DEFAULT_TIMEOUT)
 */
export type MessagingClientConnectionMethodService = {
    method: MessagingClientConnectionMethod.Service
    service: MessagingClientServiceSearchResult
    timeout?: number
}

export type MessagingClientConnectionConfiguration =
    | MessagingClientConnectionMethodRaw
    | MessagingClientConnectionMethodService

/**
 * @property timeout - defines how long should client wait for the ping (in ms)
 */
export type MessagingClientPingConfiguration = {
    timeout?: number
}

export enum MessagingClientServiceSearchUpdate {
    ServiceFound = "ServiceFound",
    ServiceLost = "ServiceLost",
    Reset = "Reset",
    Unknown = "Unknown",
}

export type MessagingClientServiceSearchResult = Omit<MessagingServiceInformation, "id">

/**
 * Object containing information about service search update
 * @property services - list of all available services
 * @property update - type of the update
 */
export type MessagingClientServiceSearchEvent = {
    services: MessagingClientServiceSearchResult[]
    update: MessagingClientServiceSearchEventUpdate
}

/**
 * Object containing information about service search update
 * @property type - type of the update
 * @property service - information about the service (not present for reset update)
 */
export type MessagingClientServiceSearchEventUpdate =
    | {
          type: MessagingClientServiceSearchUpdate.Reset | MessagingClientServiceSearchUpdate.Unknown
      }
    | {
          type: MessagingClientServiceSearchUpdate.ServiceFound | MessagingClientServiceSearchUpdate.ServiceLost
          service: MessagingClientServiceSearchResult
      }

export enum MessagingClientStatusEventName {
    Ready = "Ready",
    Stopped = "Stopped",
    ServiceInformationChanged = "ServiceInformationChanged",
    ServiceSearchStarted = "ServiceSearchStarted",
    ServiceSearchStopped = "ServiceSearchStopped",

    Unknown = "Unknown",
}

export type MessagingClientLifecycleStatusEvent = {
    type:
        | MessagingClientStatusEventName.Ready
        | MessagingClientStatusEventName.Stopped
        | MessagingClientStatusEventName.ServiceSearchStarted
        | MessagingClientStatusEventName.ServiceSearchStopped
        | MessagingClientStatusEventName.Unknown
    reason?: MessagingStoppedReason | string
}

export type MessagingClientServiceInformationStatusEvent = {
    type: MessagingClientStatusEventName.ServiceInformationChanged
    info: MessagingServiceInformation
}

export type MessagingClientStatusEvent =
    | MessagingClientLifecycleStatusEvent
    | MessagingClientServiceInformationStatusEvent
