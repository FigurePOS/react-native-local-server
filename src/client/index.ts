import type { LocalMessagingClientConfiguration, LocalMessagingClientInterface } from "./types"
import { LocalMessagingClientModule } from "./module"

export class LocalMessagingClient implements LocalMessagingClientInterface {
    readonly config: LocalMessagingClientConfiguration

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
