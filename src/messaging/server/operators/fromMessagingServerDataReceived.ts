import { EMPTY, Observable, of } from "rxjs"
import { DataObject } from "../../types"
import { LoggerVerbosity, TCPServer } from "../../../"
import { catchError, map, mergeMap } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromTCPServerEvent } from "../../../tcp/server/operators/"
import { LoggerWrapper } from "../../../utils/logger"

export const fromMessagingServerDataReceived = (serverId: string, logger: LoggerWrapper): Observable<DataObject> =>
    fromTCPServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(
        mergeMap((data) =>
            of(data).pipe(
                map(parseDataObject),
                catchError((err) => {
                    logger.error(LoggerVerbosity.Low, `MessagingServer [${serverId}] - failed to parse data`, err)
                    return EMPTY
                })
            )
        )
    )
