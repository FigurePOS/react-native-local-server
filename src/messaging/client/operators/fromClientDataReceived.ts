import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPClient } from "react-native-local-server"
import { map } from "rxjs/operators"
import { parseDataObject } from "../../functions/parseDataObject"
import { fromClientEvent } from "./fromClientEvent"

export const fromClientDataReceived = (clientId: string): Observable<DataObject> =>
    fromClientEvent(clientId, TCPClient.EventName.DataReceived).pipe(map(parseDataObject))
