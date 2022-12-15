import { MessagingServiceInformation, MessagingStoppedReason } from "../types"

/**
 * Object containing configuration of messaging client
 * @property host - target host address
 * @property port - target port
 * @property name - name of the server
 * @property serviceId - public id of the client
 * @property ping - ping configuration of the client
 */
export type MessagingClientConfiguration = {
    host: string
    port: number

    name?: string
    serviceId?: string
    ping?: MessagingClientPingConfiguration
}

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
