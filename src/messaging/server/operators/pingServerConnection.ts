import { defer, interval, merge, Observable, of, SchedulerLike, Subject, throwError } from "rxjs"
import * as uuid from "uuid"
import { catchError, filter, mapTo, mergeMap, scan, take, takeUntil, timeout } from "rxjs/operators"
import { ofServerConnectionClosed, ofServerStatusEvent } from "./ofServerStatusEvent"
import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../types"
import { composeDataObjectPing, DataObject } from "../../types"
import { ofDataTypePing } from "../../operators/ofDataType"

export const pingServerConnection = (
    connectionId: string,
    statusEvent$: Observable<MessagingServerStatusEvent>,
    dataInput$: Observable<DataObject>,
    dataOutput$: Subject<DataObject>,
    pingInterval: number,
    pingTimeout: number,
    pingRetry: number,
    scheduler?: SchedulerLike
): Observable<boolean> => {
    return interval(pingInterval, scheduler).pipe(
        mergeMap(() => {
            return defer(() => {
                const pingId = uuid.v4()
                dataOutput$.next(composeDataObjectPing(pingId, connectionId))
                return dataInput$.pipe(
                    ofDataTypePing,
                    filter((ping) => ping.pingId === pingId),
                    take(1),
                    timeout(pingTimeout, scheduler),
                    mapTo(true),
                    catchError(() => {
                        return of(false)
                    })
                )
            })
        }),
        takeUntil(
            merge(
                statusEvent$.pipe(ofServerConnectionClosed(connectionId)),
                statusEvent$.pipe(ofServerStatusEvent(MessagingServerStatusEventName.Stopped))
            )
        ),
        scan(
            ([failedCount, _]: [number, boolean], current: boolean): [number, boolean] => {
                return current ? [0, current] : [failedCount + 1, current]
            },
            [0, true]
        ),
        mergeMap(([failedCount, last]: [number, boolean]) => {
            if (failedCount >= pingRetry) {
                return throwError(`Ping failed ${failedCount} times`)
            }
            return of(last)
        })
    )
}
