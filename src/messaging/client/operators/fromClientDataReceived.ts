import { fromEvent, Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPClient } from "react-native-local-server"
import { filter, map } from "rxjs/operators"
import { TCPClientDataReceivedNativeEvent } from "../../../tcp/client/types"
import { parseDataObject } from "../../functions/parseDataObject"

export const fromClientDataReceived = (clientId: string): Observable<DataObject> =>
    fromEvent<TCPClientDataReceivedNativeEvent>(TCPClient.EventEmitter, TCPClient.EventName.DataReceived).pipe(
        filter((event: TCPClientDataReceivedNativeEvent): boolean => event.clientId === clientId),
        map(parseDataObject)
    )
