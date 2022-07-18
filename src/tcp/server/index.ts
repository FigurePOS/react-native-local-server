import type { TCPServerConfiguration, TCPServerInterface } from "./types"
import { TCPServerEventName } from "./types"
import { TCPServerModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(TCPServerModule)

export class TCPServer implements TCPServerInterface {
    readonly config: TCPServerConfiguration
    static readonly EventName = TCPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(configuration: TCPServerConfiguration) {
        this.config = configuration
    }

    getConfiguration = (): TCPServerConfiguration => {
        return this.config
    }

    start = (): Promise<void> => {
        return TCPServerModule.createServer(this.config.id, this.config.port)
    }

    stop = (): Promise<void> => {
        return TCPServerModule.stopServer(this.config.id)
    }

    sendData = (connectionId: string, message: string): Promise<void> => {
        return TCPServerModule.send(this.config.id, connectionId, message)
    }

    broadcastMessage(message: string): Promise<void> {
        return TCPServerModule.broadcast(this.config.id, message)
    }
}
