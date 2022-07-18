import { Observable } from "rxjs"
import { DataObject, DataObjectType, DataObjectMessageAck, DataObjectMessage } from "../types"
import { filter } from "rxjs/operators"

export const ofDataType =
    <T extends DataObjectType>(...types: T[]) =>
    (source$: Observable<DataObject>): Observable<Extract<DataObject, { type: T }>> =>
        // @ts-ignore
        source$.pipe(filter((data: DataObject): boolean => types.includes(data.type)))

export const ofDataTypeMessage: (source$: Observable<DataObject>) => Observable<DataObjectMessage> = ofDataType(
    DataObjectType.Message
)

export const ofDataTypeMessageAck: (source$: Observable<DataObject>) => Observable<DataObjectMessageAck> = ofDataType(
    DataObjectType.MessageAck
)
