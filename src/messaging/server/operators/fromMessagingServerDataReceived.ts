import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPServer } from "../../../"
import { map } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromTCPServerEvent } from "../../../tcp/server/operators/"

export const fromMessagingServerDataReceived = (serverId: string): Observable<DataObject> =>
    fromTCPServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(map(parseDataObject))
