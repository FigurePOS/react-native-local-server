import { Observable } from "rxjs"
import { DataObject, DataObjectType, DataObjectMessageAck, DataObjectMessage } from "../types"
import { filter } from "rxjs/operators"

export const ofDataType =
    <T extends DataObjectType, S = any, M = any>(...types: T[]) =>
    (source$: Observable<[DataObject<M>, S]>): Observable<[Extract<DataObject<M>, { type: T }>, S]> =>
        // @ts-ignore
        source$.pipe(filter(([data, _]: [DataObject, S]): boolean => types.includes(data.type)))

export const ofDataTypeMessage: <T, M>(
    source$: Observable<[DataObject<M>, T]>
) => Observable<[DataObjectMessage<M>, T]> = ofDataType(DataObjectType.Message)

export const ofDataTypeMessageAck: <T = any, M = any>(
    source$: Observable<[DataObject<M>, T]>
) => Observable<[DataObjectMessageAck, T]> = ofDataType(DataObjectType.MessageAck)
