import { defer, from, Observable } from "rxjs"
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
import { Logger, LoggerVerbosity } from "../../utils/logger/types"
import { LoggerWrapper } from "../../utils/logger/loggerWrapper"

export const CALLER_ID_PORT = 3520

/**
 * Implementation of caller id protocol (Whozz calling?)
 */
export class CallerIdServer {
    private readonly serverId: string
    private readonly config: UDPServerConfiguration
    private readonly udpServer: UDPServer
    private readonly incomingCall$: Observable<PhoneCall>
    private readonly statusEvent$: Observable<CallerIdServerStatusEvent>

    private logger: LoggerWrapper = new LoggerWrapper()

    /**
     * Constructor for the class
     * @param id - unique id, it's not possible to run two servers with the same id at the same time
     */
    constructor(id: string) {
        this.serverId = id
        this.config = {
            port: CALLER_ID_PORT,
        }
        this.incomingCall$ = fromUDPServerEvent(this.serverId, UDPServerEventName.DataReceived).pipe(
            log(LoggerVerbosity.High, this.logger, `CallerIdServer [${this.serverId}] - data received`),
            map((event: UDPServerDataReceivedNativeEvent): string => event.data),
            map(parsePhoneCallFromPacketData),
            filter((data: PhoneCall | null) => data != null) as () => Observable<PhoneCall>,
            log(LoggerVerbosity.Medium, this.logger, `CallerIdServer [${this.serverId}] - call parsed`),
            filter(hasPhoneCallGoodChecksum),
            filter(isPhoneCallInbound),
            log(LoggerVerbosity.Low, this.logger, `CallerIdServer [${this.serverId}] - call detected`),
            share()
        )
        this.statusEvent$ = fromCallerIdServerStatusEvent(this.serverId).pipe(
            log(LoggerVerbosity.Low, this.logger, `CallerIdServer [${this.serverId}] - status event`),
            share()
        )
        this.udpServer = new UDPServer(id)
    }

    /**
     * This method starts the server. You should catch any error that may occur when starting the server.
     * After starting the server there should be a CallerIdServerStatusEventName.Ready event.
     */
    start(): Observable<boolean> {
        this.logger.log(LoggerVerbosity.Low, `CallerIdServer [${this.serverId}] - start`)
        return defer(() => from(this.udpServer.start(this.config))).pipe(mapTo(true))
    }

    /**
     * This method stops the server. You should catch any error that may occur when stopping the server.
     * After stopping the server there should be a CallerIdServerStatusEventName.Stopped event.
     */
    stop(): Observable<boolean> {
        this.logger.log(LoggerVerbosity.Low, `CallerIdServer [${this.serverId}] - stop`)
        return defer(() => from(this.udpServer.stop())).pipe(mapTo(true))
    }

    /**
     * This method allows you to simulate incoming call on the local network.
     * @param call - information about the call you want to simulate
     */
    simulateCall(call: PhoneCall): Observable<boolean> {
        this.logger?.log(LoggerVerbosity.Low, `CallerIdServer [${this.serverId}] - simulate call`, call)
        return defer(() =>
            from(this.udpServer.sendData("255.255.255.255", CALLER_ID_PORT, composePacketDataFromPhoneCall(call)))
        ).pipe(mapTo(true))
    }

    /**
     * This method returns stream of all status events of the server.
     */
    getStatusEvent$(): Observable<CallerIdServerStatusEvent> {
        return this.statusEvent$
    }

    /**
     * This method returns stream of all incoming calls.
     */
    getIncomingCall$(): Observable<PhoneCall> {
        return this.incomingCall$
    }

    /**
     * This method sets logger and its verbosity.
     * @param logger - logger object to be used when logging
     * @param verbosity - verbosity of the logger
     */
    setLogger = (logger: Logger | null, verbosity?: LoggerVerbosity) => {
        this.logger.setLogger(logger, verbosity ?? LoggerVerbosity.Medium)
        this.udpServer.setLogger(logger, verbosity)
    }
}
