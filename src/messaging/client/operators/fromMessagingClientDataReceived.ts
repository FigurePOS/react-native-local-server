import { EMPTY, Observable, of } from "rxjs"
import { catchError, map, mergeMap } from "rxjs/operators"

import { LoggerVerbosity, TCPClient } from "../../../"
import { fromTCPClientEvent } from "../../../tcp/client/operators"
import { LoggerWrapper } from "../../../utils/logger"
import { parseDataObject } from "../../functions/parseDataObject"
import { DataObject } from "../../types"

export const fromMessagingClientDataReceived = (clientId: string, logger: LoggerWrapper): Observable<DataObject> =>
    fromTCPClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(
        mergeMap((data) =>
            of(data).pipe(
                map(parseDataObject),
                catchError((err) => {
                    logger.error(LoggerVerbosity.Low, `MessagingClient [${clientId}] - failed to parse data`, err)
                    return EMPTY
                }),
            ),
        ),
    )
