import { Observable, of, SchedulerLike, Subject, throwError, TimeoutError } from "rxjs"
import { catchError, mergeMap, takeUntil, timeout } from "rxjs/operators"
import { MessagingClientStatusEvent, MessagingClientStatusEventName } from "../types"
import { DataObject, DataObjectPing } from "../../types"
import { ofDataTypePing } from "../../operators/ofDataType"
import { ofMessagingClientStatusEvent } from "./"

export const pingMessagingClient = (
    statusEvent$: Observable<MessagingClientStatusEvent>,
    dataInput$: Observable<DataObject>,
    dataOutput$: Subject<DataObject>,
    pingTimeout: number,
    scheduler?: SchedulerLike
): Observable<boolean> => {
    return dataInput$.pipe(
        ofDataTypePing,
        takeUntil(statusEvent$.pipe(ofMessagingClientStatusEvent(MessagingClientStatusEventName.Stopped))),
        timeout(pingTimeout, scheduler),
        catchError((err) => {
            if (err instanceof TimeoutError) {
                return throwError("Server ping timed out", scheduler)
            }
            return throwError(err)
        }),
        mergeMap((ping: DataObjectPing) => {
            dataOutput$.next(ping)
            return of(true)
        })
    )
}
