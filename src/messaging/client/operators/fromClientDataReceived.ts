import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPClient } from "../../../"
import { map } from "rxjs/operators"
import { fromClientEvent } from "./fromClientEvent"
import { parseDataObject } from "../../functions/parseDataObject"

export const fromClientDataReceived = (clientId: string): Observable<DataObject> =>
    fromClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(map(parseDataObject))
