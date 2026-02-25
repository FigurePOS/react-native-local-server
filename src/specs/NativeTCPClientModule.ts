import type { TurboModule } from "react-native"
import { TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
    createClient(id: string, host: string, port: number): Promise<boolean>
    createClientFromDiscovery(id: string, discoveryGroup: string, discoveryName: string): Promise<boolean>
    stopClient(id: string, reason: string): Promise<boolean>
    send(clientId: string, message: string): Promise<boolean>
    addListener(eventType: string): void
    removeListeners(count: number): void
}

export default TurboModuleRegistry.getEnforcing<Spec>("TCPClientModule")
