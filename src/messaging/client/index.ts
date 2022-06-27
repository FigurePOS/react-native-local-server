import type { LocalMessagingClientConfiguration, LocalMessagingClientInterface } from "./types"
import { LocalMessagingClientEventName } from "./types"
import { LocalMessagingClientModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(LocalMessagingClientModule)

export class LocalMessagingClient implements LocalMessagingClientInterface {
    readonly config: LocalMessagingClientConfiguration
    static readonly EventName = LocalMessagingClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(configuration: LocalMessagingClientConfiguration) {
        this.config = configuration
    }

    getConfiguration = (): LocalMessagingClientConfiguration => {
        return this.config
    }

    sendMessage = (message: string): Promise<void> => {
        return LocalMessagingClientModule.send(this.config.id, message)
    }

    start = (): Promise<void> => {
        return LocalMessagingClientModule.createClient(this.config.id, this.config.host, this.config.port)
    }

    stop = (): Promise<void> => {
        return LocalMessagingClientModule.stopClient(this.config.id)
    }
}
