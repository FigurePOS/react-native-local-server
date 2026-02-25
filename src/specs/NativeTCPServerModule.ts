import type { TurboModule } from "react-native"
import { TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
    createServer(id: string, port: number, discoveryGroup: string | null, discoveryName: string | null): Promise<boolean>
    stopServer(id: string, reason: string): Promise<boolean>
    send(serverId: string, connectionId: string, message: string): Promise<boolean>
    closeConnection(serverId: string, connectionId: string, reason: string): Promise<boolean>
    getConnectionIds(serverId: string): Promise<string[]>
    getLocalIpAddress(): Promise<string | null>
    addListener(eventType: string): void
    removeListeners(count: number): void
}

export default TurboModuleRegistry.getEnforcing<Spec>("TCPServerModule")
