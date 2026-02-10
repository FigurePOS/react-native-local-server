import { GroupedObservable, NEVER, Observable, SchedulerLike, timer } from "rxjs"
import { exhaustMap, groupBy, mergeMap, take } from "rxjs/operators"

export const deduplicateBy =
    <T>(
        keyExtractor: (value: T) => string | null | undefined,
        duration: number | undefined = undefined,
        scheduler: SchedulerLike | undefined = undefined,
    ) =>
    (source$: Observable<T>): Observable<T> =>
        source$.pipe(
            groupBy(keyExtractor, { duration: groupDuration(duration, scheduler) }),
            mergeMap((group$) => (group$.key == null ? group$ : group$.pipe(take(1)))),
        )

const groupDuration = (duration: number | undefined, scheduler: SchedulerLike | undefined) => {
    if (duration == null) {
        return undefined
    }
    return (group$: GroupedObservable<unknown, unknown>) =>
        group$.key == null ? NEVER : group$.pipe(exhaustMap(() => timer(duration, scheduler)))
}
