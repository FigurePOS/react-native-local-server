export type ServiceBrowserInfo = {
    name: string
    host: string
    port: number
    type: string
}

export enum ServiceBrowserEventName {
    Started = "RN_Local_Communication__Service_Browser_Started",
    Stopped = "RN_Local_Communication__Service_Browser_Stopped",
    ServiceFound = "RN_Local_Communication__Service_Browser_Service_Found",
    ServiceLost = "RN_Local_Communication__Service_Browser_Service_Lost",
}

export type ServiceBrowserStartedNativeEvent = {
    type: ServiceBrowserEventName.Started
    browserId: string
}

export type ServiceBrowserStoppedNativeEvent = {
    type: ServiceBrowserEventName.Stopped
    browserId: string
}

export type ServiceBrowserServiceFoundNativeEvent = ServiceBrowserInfo & {
    type: ServiceBrowserEventName.ServiceFound
    browserId: string
}

export type ServiceBrowserServiceLostNativeEvent = ServiceBrowserInfo & {
    type: ServiceBrowserEventName.ServiceLost
    browserId: string
}

export type ServiceBrowserNativeEvent =
    | ServiceBrowserStartedNativeEvent
    | ServiceBrowserStoppedNativeEvent
    | ServiceBrowserServiceFoundNativeEvent
    | ServiceBrowserServiceLostNativeEvent
