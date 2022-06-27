import type { TCPClientConfiguration, TCPClientInterface } from "./types"
import { TCPClientEventName } from "./types"
import { TCPClientModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(TCPClientModule)

export class TCPClient implements TCPClientInterface {
    readonly config: TCPClientConfiguration
    static readonly EventName = TCPClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(configuration: TCPClientConfiguration) {
        this.config = configuration
    }

    getConfiguration = (): TCPClientConfiguration => {
        return this.config
    }

    sendMessage = (message: string): Promise<void> => {
        return TCPClientModule.send(this.config.id, message)
    }

    start = (): Promise<void> => {
        return TCPClientModule.createClient(this.config.id, this.config.host, this.config.port)
    }

    stop = (): Promise<void> => {
        return TCPClientModule.stopClient(this.config.id)
    }
}
