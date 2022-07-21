import { Observable } from "rxjs"
import { DataObject } from "../../types"
import { TCPServer } from "../../../"
import { map } from "rxjs/operators"
import { fromServerEvent } from "./fromServerEvent"
import { MessagingServerMessageAdditionalInfo } from "../types"
import { parseServerDataObject } from "../../functions/parseDataObject"

export const fromServerDataReceived = (
    serverId: string
): Observable<[DataObject, MessagingServerMessageAdditionalInfo]> =>
    fromServerEvent(serverId, TCPServer.EventName.DataReceived).pipe(map(parseServerDataObject))
