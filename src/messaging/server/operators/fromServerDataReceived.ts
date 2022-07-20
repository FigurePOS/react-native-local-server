import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPServer } from "../../../"
import { map } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromServerEvent } from "./fromServerEvent"

export const fromServerDataReceived = (serverId: string): Observable<DataObject> =>
    fromServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(map(parseDataObject))
