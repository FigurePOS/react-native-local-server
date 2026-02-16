import { Observable } from "rxjs"
import { RunHelpers, TestScheduler } from "rxjs/testing"

export type MappedHelpers = Omit<RunHelpers, "expectObservable"> & {
    expect: <T>(
        observable: Observable<T>,
        subscriptionMarbles?: string | null,
    ) => {
        toBe: (marbles: string, values?: unknown, errorValue?: unknown) => void
        toBeObservable: (other: Observable<T>) => void
    }
    scheduler: TestScheduler
}

export const marbles = <T>(callback: (helpers: MappedHelpers) => T): (() => T) => {
    const testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected))

    return () =>
        testScheduler.run((helpers: RunHelpers) => {
            const mappedHelpers: MappedHelpers = {
                ...helpers,
                scheduler: testScheduler,
                expect: <U>(observable$: Observable<U>, subscriptionMarbles: string | null = null) => {
                    const result = helpers.expectObservable(observable$, subscriptionMarbles)
                    return {
                        ...result,
                        toBeObservable: result.toEqual,
                    }
                },
            }

            return callback(mappedHelpers)
        })
}
