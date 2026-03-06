import type { TurboModule, CodegenTypes } from "react-native"
import { TurboModuleRegistry } from "react-native"

type TCPServerReadyEvent = {
    type: string
    serverId: string
    port: string
}

type TCPServerStoppedEvent = {
    type: string
    serverId: string
    port: string
    reason: string
}

type TCPServerConnectionAcceptedEvent = {
    type: string
    serverId: string
    connectionId: string
}

type TCPServerConnectionReadyEvent = {
    type: string
    serverId: string
    connectionId: string
}

type TCPServerConnectionClosedEvent = {
    type: string
    serverId: string
    connectionId: string
    reason: string
}

type TCPServerDataReceivedEvent = {
    type: string
    serverId: string
    connectionId: string
    data: string
}

export interface Spec extends TurboModule {
    createServer(
        id: string,
        port: number,
        discoveryGroup: string | null,
        discoveryName: string | null,
    ): Promise<boolean>
    stopServer(id: string, reason: string): Promise<boolean>
    send(serverId: string, connectionId: string, message: string): Promise<boolean>
    closeConnection(serverId: string, connectionId: string, reason: string): Promise<boolean>
    getConnectionIds(serverId: string): Promise<string[]>
    getLocalIpAddress(): Promise<string | null>
    readonly onReady: CodegenTypes.EventEmitter<TCPServerReadyEvent>
    readonly onStopped: CodegenTypes.EventEmitter<TCPServerStoppedEvent>
    readonly onConnectionAccepted: CodegenTypes.EventEmitter<TCPServerConnectionAcceptedEvent>
    readonly onConnectionReady: CodegenTypes.EventEmitter<TCPServerConnectionReadyEvent>
    readonly onConnectionClosed: CodegenTypes.EventEmitter<TCPServerConnectionClosedEvent>
    readonly onDataReceived: CodegenTypes.EventEmitter<TCPServerDataReceivedEvent>
}

export default TurboModuleRegistry.getEnforcing<Spec>("TCPServerModule")
