import { Observable } from "rxjs"
import { DataObject, DataObjectType, DataObjectMessageAck, DataObjectMessage } from "../types"
import { filter } from "rxjs/operators"

export const ofDataType =
    <T extends DataObjectType, S = any>(...types: T[]) =>
    (source$: Observable<[DataObject, S]>): Observable<[Extract<DataObject, { type: T }>, S]> =>
        // @ts-ignore
        source$.pipe(filter(([data, _]: [DataObject, S]): boolean => types.includes(data.type)))

export const ofDataTypeMessage: <T>(source$: Observable<[DataObject, T]>) => Observable<[DataObjectMessage, T]> =
    ofDataType(DataObjectType.Message)

export const ofDataTypeMessageAck: <T = any>(
    source$: Observable<[DataObject, T]>
) => Observable<[DataObjectMessageAck, T]> = ofDataType(DataObjectType.MessageAck)
