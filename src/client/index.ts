import type { LocalMessagingClientConfiguration, LocalMessagingClientInterface } from "./types"
import { LocalMessagingClientModule } from "./module"

export class LocalMessagingClient implements LocalMessagingClientInterface {
    readonly config: LocalMessagingClientConfiguration

    constructor(configuration: LocalMessagingClientConfiguration) {
        console.log(configuration)
        this.config = configuration
    }

    getConfiguration = (): LocalMessagingClientConfiguration => {
        return this.config
    }

    sendMessage = (message: string): Promise<void> => {
        return LocalMessagingClientModule.send(this.config.id, message)
    }

    start = (): Promise<void> => {
        console.log(this.config)
        return LocalMessagingClientModule.createClient(this.config.id, this.config.host, this.config.port)
    }

    stop = (): Promise<void> => {
        return LocalMessagingClientModule.stopClient()
    }
}
