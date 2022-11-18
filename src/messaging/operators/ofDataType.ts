import { Observable } from "rxjs"
import {
    DataObject,
    DataObjectMessage,
    DataObjectMessageAck,
    DataObjectPing,
    DataObjectServiceInfo,
    DataObjectType,
} from "../types"
import { filter } from "rxjs/operators"

export const ofDataType =
    <T extends DataObjectType, M>(...types: T[]) =>
    (source$: Observable<DataObject<M>>): Observable<Extract<DataObject<M>, { type: T }>> =>
        // @ts-ignore
        source$.pipe(filter((data: DataObject): boolean => types.includes(data.type)))

export const ofDataTypeMessage: <M>(source$: Observable<DataObject<M>>) => Observable<DataObjectMessage<M>> =
    ofDataType(DataObjectType.Message)

export const ofDataTypeMessageAck: <M>(source$: Observable<DataObject<M>>) => Observable<DataObjectMessageAck> =
    ofDataType(DataObjectType.MessageAck)

export const ofDataTypePing: <M>(source$: Observable<DataObject<M>>) => Observable<DataObjectPing> = ofDataType(
    DataObjectType.Ping
)

export const ofDataTypeServiceInfo: <M>(source$: Observable<DataObject<M>>) => Observable<DataObjectServiceInfo> =
    ofDataType(DataObjectType.ServiceInfo)
