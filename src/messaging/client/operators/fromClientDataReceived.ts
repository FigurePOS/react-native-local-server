import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPClient } from "react-native-local-server"
import { map } from "rxjs/operators"
import { fromClientEvent } from "./fromClientEvent"
import { parseClientDataObject } from "../../functions/parseDataObject"

export const fromClientDataReceived = (clientId: string): Observable<[DataObject, null]> =>
    fromClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(map(parseClientDataObject))
