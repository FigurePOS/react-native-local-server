import { EMPTY, Observable, of } from "rxjs"
import { catchError, map, mergeMap } from "rxjs/operators"

import { LoggerVerbosity, TCPServer } from "../../../"
import { fromTCPServerEvent } from "../../../tcp/server/operators/"
import { LoggerWrapper } from "../../../utils/logger"
import { parseDataObject } from "../../functions/parseDataObject"
import { DataObject } from "../../types"

export const fromMessagingServerDataReceived = (serverId: string, logger: LoggerWrapper): Observable<DataObject> =>
    fromTCPServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(
        mergeMap((data) =>
            of(data).pipe(
                map(parseDataObject),
                catchError((err: unknown) => {
                    logger.error(LoggerVerbosity.Low, `MessagingServer [${serverId}] - failed to parse data`, err)
                    return EMPTY
                }),
            ),
        ),
    )
