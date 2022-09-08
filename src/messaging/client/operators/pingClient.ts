import { Observable, of, SchedulerLike, Subject, throwError, TimeoutError } from "rxjs"
import { catchError, mergeMap, takeUntil, timeout } from "rxjs/operators"
import { MessagingClientStatusEvent, MessagingClientStatusEventName } from "../types"
import { DataObject, DataObjectPing } from "../../types"
import { ofDataTypePing } from "../../operators/ofDataType"
import { ofClientStatusEvent } from "./ofClientStatusEvent"

export const pingClient = (
    statusEvent$: Observable<MessagingClientStatusEvent>,
    dataInput$: Observable<DataObject>,
    dataOutput$: Subject<DataObject>,
    pingTimeout: number,
    scheduler?: SchedulerLike
): Observable<boolean> => {
    return dataInput$.pipe(
        ofDataTypePing,
        takeUntil(statusEvent$.pipe(ofClientStatusEvent(MessagingClientStatusEventName.Stopped))),
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
