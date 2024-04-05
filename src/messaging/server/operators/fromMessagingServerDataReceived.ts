import { EMPTY, Observable, of } from "rxjs"
import { DataObject } from "../../types"
import { TCPServer } from "../../../"
import { catchError, map, mergeMap } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromTCPServerEvent } from "../../../tcp/server/operators/"

export const fromMessagingServerDataReceived = (serverId: string): Observable<DataObject> =>
    fromTCPServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(
        mergeMap((data) =>
            of(data).pipe(
                map(parseDataObject),
                catchError(() => {
                    // log error
                    return EMPTY
                })
            )
        )
    )
