import { merge, Observable } from "rxjs"
import { map } from "rxjs/operators"

import { fromServiceBrowserEvent, MessagingClientStatusEvent, ServiceBrowser, TCPClient } from "../../../"
import { fromTCPClientEvent } from "../../../tcp/client/operators"
import { LoggerWrapper } from "../../../utils/logger"
import { ofDataTypeServiceInfo } from "../../operators/ofDataType"
import {
    composeMessagingClientServiceInformationStatusEvent,
    composeMessagingClientStatusEvent,
    getBrowserIdFromMessagingClientId,
} from "../functions"

import { fromMessagingClientDataReceived } from "./fromMessagingClientDataReceived"


export const fromMessagingClientStatusEvent = (
    clientId: string,
    logger: LoggerWrapper,
): Observable<MessagingClientStatusEvent> =>
    merge(
        merge(
            fromTCPClientEvent(clientId, TCPClient.EventName.Ready),
            fromTCPClientEvent(clientId, TCPClient.EventName.Stopped),
            fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.Started),
            fromServiceBrowserEvent(getBrowserIdFromMessagingClientId(clientId), ServiceBrowser.EventName.Stopped),
        ).pipe(map(composeMessagingClientStatusEvent)),
        fromMessagingClientDataReceived(clientId, logger).pipe(
            ofDataTypeServiceInfo,
            map(composeMessagingClientServiceInformationStatusEvent),
        ),
    )
