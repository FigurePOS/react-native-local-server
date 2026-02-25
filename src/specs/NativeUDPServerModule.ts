import type { TurboModule } from "react-native"
import { TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
    createServer(id: string, port: number, numberOfDroppedBytesFromMsgStart: number): Promise<boolean>
    stopServer(id: string, reason: string): Promise<boolean>
    send(host: string, port: number, message: string): Promise<boolean>
    addListener(eventType: string): void
    removeListeners(count: number): void
}

export default TurboModuleRegistry.getEnforcing<Spec>("UDPServerModule")
