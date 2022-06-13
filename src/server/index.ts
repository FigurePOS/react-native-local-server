import type { LocalMessagingServerConfiguration, LocalMessagingServerInterface } from "./types"
import { LocalMessagingServerEventName } from "./types"
import { LocalMessagingServerModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(LocalMessagingServerModule)

export class LocalMessagingServer implements LocalMessagingServerInterface {
    readonly config: LocalMessagingServerConfiguration
    static readonly EventName = LocalMessagingServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(configuration: LocalMessagingServerConfiguration) {
        this.config = configuration
    }

    getConfiguration = (): LocalMessagingServerConfiguration => {
        return this.config
    }

    start = (): Promise<void> => {
        return LocalMessagingServerModule.createServer(this.config.id, this.config.port)
    }

    stop = (): Promise<void> => {
        return LocalMessagingServerModule.stopServer(this.config.id)
    }

    sendMessage = (connectionId: string, message: string): Promise<void> => {
        return LocalMessagingServerModule.send(this.config.id, connectionId, message)
    }

    broadcastMessage(message: string): Promise<void> {
        return LocalMessagingServerModule.broadcast(this.config.id, message)
    }
}
