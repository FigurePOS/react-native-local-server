import { Observable, of, SchedulerLike, Subject, throwError, TimeoutError } from "rxjs"
import { catchError, mergeMap, observeOn, takeUntil, timeout } from "rxjs/operators"
import { MessagingClientStatusEvent, MessagingClientStatusEventName } from "../types"
import { DataObject, DataObjectType } from "../../types"
import { ofMessagingClientStatusEvent } from "./"

export const pingMessagingClient = (
    statusEvent$: Observable<MessagingClientStatusEvent>,
    dataInput$: Observable<DataObject>,
    dataOutput$: Subject<DataObject>,
    pingTimeout: number,
    scheduler?: SchedulerLike
): Observable<boolean> => {
    return dataInput$.pipe(
        takeUntil(statusEvent$.pipe(ofMessagingClientStatusEvent(MessagingClientStatusEventName.Stopped))),
        timeout(pingTimeout, scheduler),
        catchError((err) => {
            if (err instanceof TimeoutError) {
                if (scheduler) {
                    throwError(() => new Error("Server ping timed out")).pipe(observeOn(scheduler))
                }
                throwError(() => new Error("Server ping timed out"))
            }
            return throwError(() => new Error(err))
        }),
        mergeMap((data: DataObject) => {
            if (data.type === DataObjectType.Ping) {
                dataOutput$.next(data)
            }
            return of(true)
        })
    )
}
