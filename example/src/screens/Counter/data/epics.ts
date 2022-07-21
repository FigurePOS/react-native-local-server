import { ActionsObservable, Epic, ofType, StateObservable } from "redux-observable"
import { StateAction } from "../../../types"
import {
    COUNTER_AUTO_INCREMENT_STARTED,
    COUNTER_AUTO_INCREMENT_STOPPED,
    COUNTER_COUNT_DECREASED,
    COUNTER_COUNT_INCREMENTED,
    COUNTER_COUNT_RESET,
    createActionCounterCountChanged,
    createActionCounterCountIncremented,
} from "./actionts"
import { switchMap, takeUntil } from "rxjs/operators"
import { StateObject } from "../../../rootReducer"
import { getCounterCount } from "./selectors"
import { interval } from "rxjs"

export const counterIncrementedEpic: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>
) =>
    action$.pipe(
        ofType(COUNTER_COUNT_INCREMENTED),
        switchMap(() => {
            const current = getCounterCount(state$.value)
            return [createActionCounterCountChanged(current + 1)]
        })
    )

export const counterDecreasedEpic: Epic = (
    action$: ActionsObservable<StateAction>,
    state$: StateObservable<StateObject>
) =>
    action$.pipe(
        ofType(COUNTER_COUNT_DECREASED),
        switchMap(() => {
            const current = getCounterCount(state$.value)
            return [createActionCounterCountChanged(current - 1)]
        })
    )

export const counterResetEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_RESET),
        switchMap(() => {
            return [createActionCounterCountChanged(0)]
        })
    )

export const counterAutoIncrementEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_AUTO_INCREMENT_STARTED),
        switchMap(() => {
            return interval(1000).pipe(
                takeUntil(action$.pipe(ofType(COUNTER_AUTO_INCREMENT_STOPPED))),
                switchMap(() => {
                    return [createActionCounterCountIncremented()]
                })
            )
        })
    )

export default [counterIncrementedEpic, counterDecreasedEpic, counterResetEpic, counterAutoIncrementEpic]
