import type { TCPClientConfiguration, TCPClientInterface } from "./types"
import { TCPClientEventName } from "./types"
import { TCPClientModule } from "./module"
import { NativeEventEmitter } from "react-native"

const eventEmitter = new NativeEventEmitter(TCPClientModule)

export class TCPClient implements TCPClientInterface {
    private readonly id: string
    private config: TCPClientConfiguration | null = null
    static readonly EventName = TCPClientEventName
    static readonly EventEmitter: NativeEventEmitter = eventEmitter

    constructor(id: string) {
        this.id = id
    }

    getId = (): string => {
        return this.id
    }

    getConfiguration = (): TCPClientConfiguration | null => {
        return this.config
    }

    start = (config: TCPClientConfiguration): Promise<void> => {
        this.config = config
        return TCPClientModule.createClient(this.getId(), this.config.host, this.config.port)
    }

    sendData = (data: string): Promise<void> => {
        return TCPClientModule.send(this.getId(), data)
    }

    stop = (): Promise<void> => {
        return TCPClientModule.stopClient(this.getId())
    }
}
