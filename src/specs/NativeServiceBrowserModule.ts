import type { TurboModule } from "react-native"
import { TurboModuleRegistry } from "react-native"

export interface Spec extends TurboModule {
    createBrowser(id: string, discoveryGroup: string): Promise<boolean>
    stopBrowser(id: string): Promise<boolean>
    addListener(eventType: string): void
    removeListeners(count: number): void
}

export default TurboModuleRegistry.getEnforcing<Spec>("ServiceBrowserModule")
