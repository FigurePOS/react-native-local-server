import type { TCPServerConfiguration, TCPServerInterface } from "./types"
import { TCPServerEventName } from "./types"
import { TCPServerModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(TCPServerModule)

export class TCPServer implements TCPServerInterface {
    private readonly id: string
    private config: TCPServerConfiguration | null = null
    static readonly EventName = TCPServerEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(id: string) {
        this.id = id
    }

    getId = (): string => {
        return this.id
    }

    getConfiguration = (): TCPServerConfiguration | null => {
        return this.config
    }

    start = (configuration: TCPServerConfiguration): Promise<void> => {
        this.config = configuration
        return TCPServerModule.createServer(this.getId(), this.config.port)
    }

    sendData = (connectionId: string, data: string): Promise<void> => {
        return TCPServerModule.send(this.getId(), connectionId, data)
    }

    stop = (): Promise<void> => {
        return TCPServerModule.stopServer(this.getId())
    }
}
