import { defer, from, Observable } from "rxjs"
import { Logger, LoggerVerbosity } from "../../utils/types"
import { DefaultLogger } from "../../utils/logger"
import {
    fromUDPServerEvent,
    UDPServer,
    UDPServerConfiguration,
    UDPServerDataReceivedNativeEvent,
    UDPServerEventName,
} from "../../udp"
import { filter, map, mapTo, share } from "rxjs/operators"
import { PhoneCall } from "../types"
import { CallerIdServerStatusEvent } from "./types"
import { composePacketDataFromPhoneCall, parsePhoneCallFromPacketData } from "../parser"
import { log } from "../../utils/operators/log"
import { hasPhoneCallGoodChecksum, isPhoneCallInbound } from "../functions"
import { fromCallerIdServerStatusEvent } from "./operators/fromCallerIdServerStatusEvent"

export const CALLER_ID_PORT = 3520

export class CallerIdServer {
    private readonly serverId: string
    private readonly config: UDPServerConfiguration
    private readonly udpServer: UDPServer
    private readonly incomingCall$: Observable<PhoneCall>
    private readonly statusEvent$: Observable<CallerIdServerStatusEvent>

    private logger: Logger | null = DefaultLogger

    constructor(id: string) {
        this.serverId = id
        this.config = {
            port: CALLER_ID_PORT,
        }
        this.incomingCall$ = fromUDPServerEvent(this.serverId, UDPServerEventName.DataReceived).pipe(
            log(this.logger, `CallerIdServer [${this.serverId}] - data received`),
            map((event: UDPServerDataReceivedNativeEvent): string => event.data),
            map(parsePhoneCallFromPacketData),
            filter((data: PhoneCall | null) => data != null) as () => Observable<PhoneCall>,
            log(this.logger, `CallerIdServer [${this.serverId}] - call parsed`),
            filter(hasPhoneCallGoodChecksum),
            filter(isPhoneCallInbound),
            log(this.logger, `CallerIdServer [${this.serverId}] - call detected`),
            share()
        )
        this.statusEvent$ = fromCallerIdServerStatusEvent(this.serverId).pipe(
            log(this.logger, `CallerIdServer [${this.serverId}] - status event`),
            share()
        )
        this.udpServer = new UDPServer(id)
        this.udpServer.setLogger(null)
    }

    start(): Observable<boolean> {
        this.logger?.log(`CallerIdServer [${this.serverId}] - start`)
        return defer(() => from(this.udpServer.start(this.config))).pipe(mapTo(true))
    }

    stop(): Observable<boolean> {
        this.logger?.log(`CallerIdServer [${this.serverId}] - stop`)
        return defer(() => from(this.udpServer.stop())).pipe(mapTo(true))
    }

    simulateCall(call: PhoneCall): Observable<boolean> {
        this.logger?.log(`CallerIdServer [${this.serverId}] - simulate call`, call)
        return defer(() =>
            from(this.udpServer.sendData("255.255.255.255", CALLER_ID_PORT, composePacketDataFromPhoneCall(call)))
        ).pipe(mapTo(true))
    }

    getStatusEvent$(): Observable<CallerIdServerStatusEvent> {
        return this.statusEvent$
    }

    getIncomingCall$(): Observable<PhoneCall> {
        return this.incomingCall$
    }

    setLogger(logger: Logger | null): void {
        this.logger = logger
        if (this.logger?.verbosity === LoggerVerbosity.TCP) {
            this.udpServer.setLogger(logger)
        } else {
            this.udpServer.setLogger(null)
        }
    }
}
