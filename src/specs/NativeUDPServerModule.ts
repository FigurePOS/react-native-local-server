import type { TurboModule, CodegenTypes } from "react-native"
import { TurboModuleRegistry } from "react-native"

type UDPServerReadyEvent = {
    type: string
    serverId: string
}

type UDPServerStoppedEvent = {
    type: string
    serverId: string
    reason: string
}

type UDPServerDataReceivedEvent = {
    type: string
    serverId: string
    data: string
}

export interface Spec extends TurboModule {
    createServer(id: string, port: number, numberOfDroppedBytesFromMsgStart: number): Promise<boolean>
    stopServer(id: string, reason: string): Promise<boolean>
    send(host: string, port: number, message: string): Promise<boolean>
    readonly onReady: CodegenTypes.EventEmitter<UDPServerReadyEvent>
    readonly onStopped: CodegenTypes.EventEmitter<UDPServerStoppedEvent>
    readonly onDataReceived: CodegenTypes.EventEmitter<UDPServerDataReceivedEvent>
}

export default TurboModuleRegistry.getEnforcing<Spec>("UDPServerModule")
