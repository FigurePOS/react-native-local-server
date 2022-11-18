import * as uuid from "uuid"
import { defer, interval, merge, Observable, of, SchedulerLike, Subject, throwError } from "rxjs"
import { catchError, mapTo, mergeMap, scan, take, takeUntil, timeout } from "rxjs/operators"
import { ofMessagingServerConnectionClosed, ofMessagingServerStatusEvent } from "./ofMessagingServerStatusEvent"
import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../types"
import { composeDataObjectPing, DataObject } from "../../types"

export const pingMessagingServerConnection = (
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
                statusEvent$.pipe(ofMessagingServerConnectionClosed(connectionId)),
                statusEvent$.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.Stopped))
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
