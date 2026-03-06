import type { TurboModule, CodegenTypes } from "react-native"
import { TurboModuleRegistry } from "react-native"

type ServiceBrowserStartedEvent = {
    type: string
    browserId: string
}

type ServiceBrowserStoppedEvent = {
    type: string
    browserId: string
}

type ServiceBrowserServiceFoundEvent = {
    type: string
    browserId: string
    name: string
    group: string
    host: string
    port: number
}

type ServiceBrowserServiceLostEvent = {
    type: string
    browserId: string
    name: string
    group: string
    host: string
    port: number
}

export interface Spec extends TurboModule {
    createBrowser(id: string, discoveryGroup: string): Promise<boolean>
    stopBrowser(id: string): Promise<boolean>
    readonly onStarted: CodegenTypes.EventEmitter<ServiceBrowserStartedEvent>
    readonly onStopped: CodegenTypes.EventEmitter<ServiceBrowserStoppedEvent>
    readonly onServiceFound: CodegenTypes.EventEmitter<ServiceBrowserServiceFoundEvent>
    readonly onServiceLost: CodegenTypes.EventEmitter<ServiceBrowserServiceLostEvent>
}

export default TurboModuleRegistry.getEnforcing<Spec>("ServiceBrowserModule")
