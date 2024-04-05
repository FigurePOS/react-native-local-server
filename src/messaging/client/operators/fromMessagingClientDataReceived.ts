import { EMPTY, Observable, of } from "rxjs"
import { DataObject } from "../../types"
import { LoggerVerbosity, TCPClient } from "../../../"
import { catchError, map, mergeMap } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromTCPClientEvent } from "../../../tcp/client/operators"
import { LoggerWrapper } from "../../../utils/logger"

export const fromMessagingClientDataReceived = (clientId: string, logger: LoggerWrapper): Observable<DataObject> =>
    fromTCPClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(
        mergeMap((data) =>
            of(data).pipe(
                map(parseDataObject),
                catchError((err) => {
                    logger.error(LoggerVerbosity.Low, `MessagingClient [${clientId}] - failed to parse data`, err)
                    return EMPTY
                })
            )
        )
    )
