import { merge, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { MessagingClientStatusEvent, TCPClient } from "../../../"
import { composeMessagingClientServiceInformationStatusEvent, composeMessagingClientStatusEvent } from "../functions"
import { fromTCPClientEvent } from "../../../tcp/client/operators"
import { fromMessagingClientDataReceived } from "./fromMessagingClientDataReceived"
import { ofDataTypeServiceInfo } from "../../operators/ofDataType"

export const fromMessagingClientStatusEvent = (clientId: string): Observable<MessagingClientStatusEvent> =>
    merge(
        merge(
            fromTCPClientEvent(clientId, TCPClient.EventName.Ready),
            fromTCPClientEvent(clientId, TCPClient.EventName.Stopped)
        ).pipe(map(composeMessagingClientStatusEvent)),
        fromMessagingClientDataReceived(clientId).pipe(
            ofDataTypeServiceInfo,
            map(composeMessagingClientServiceInformationStatusEvent)
        )
    )
