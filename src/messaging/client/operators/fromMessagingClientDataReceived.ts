import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPClient } from "../../../"
import { map } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromTCPClientEvent } from "../../../tcp/client/operators"

export const fromMessagingClientDataReceived = (clientId: string): Observable<DataObject> =>
    fromTCPClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(map(parseDataObject))
