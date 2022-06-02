import type { LocalMessagingServerConfiguration, LocalMessagingServerInterface } from "./types"
import { LocalMessagingServerModule } from "./module"

export class LocalMessagingServer implements LocalMessagingServerInterface {
    readonly config: LocalMessagingServerConfiguration

    constructor(configuration: LocalMessagingServerConfiguration) {
        console.log(configuration)
        this.config = configuration
    }

    getConfiguration = (): LocalMessagingServerConfiguration => {
        return this.config
    }

    start = (): Promise<void> => {
        console.log(this.config)
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
