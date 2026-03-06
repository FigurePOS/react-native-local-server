import type { TurboModule, CodegenTypes } from "react-native"
import { TurboModuleRegistry } from "react-native"

type TCPClientReadyEvent = {
    type: string
    clientId: string
}

type TCPClientStoppedEvent = {
    type: string
    clientId: string
    reason: string
}

type TCPClientDataReceivedEvent = {
    type: string
    clientId: string
    data: string
}

export interface Spec extends TurboModule {
    createClient(id: string, host: string, port: number): Promise<boolean>
    createClientFromDiscovery(id: string, discoveryGroup: string, discoveryName: string): Promise<boolean>
    stopClient(id: string, reason: string): Promise<boolean>
    send(clientId: string, message: string): Promise<boolean>
    readonly onReady: CodegenTypes.EventEmitter<TCPClientReadyEvent>
    readonly onStopped: CodegenTypes.EventEmitter<TCPClientStoppedEvent>
    readonly onDataReceived: CodegenTypes.EventEmitter<TCPClientDataReceivedEvent>
}

export default TurboModuleRegistry.getEnforcing<Spec>("TCPClientModule")
