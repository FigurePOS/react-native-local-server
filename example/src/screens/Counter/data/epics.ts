import { not, pipe } from "ramda"
import { ofType, StateObservable } from "redux-observable"
import { interval, Observable } from "rxjs"
import { switchMap, takeUntil } from "rxjs/operators"

import { filterWithSelector } from "../../../common/operators/filterWithSelector"
import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"
import { isCounterClientRunning } from "../client/selectors"

import {
    COUNTER_AUTO_INCREMENT_STARTED,
    COUNTER_AUTO_INCREMENT_STOPPED,
    COUNTER_COUNT_DECREASED,
    COUNTER_COUNT_INCREMENTED,
    COUNTER_COUNT_RESET,
    COUNTER_COUNT_RESET_REQUESTED,
    createActionCounterCountChanged,
    createActionCounterCountIncremented,
    createActionCounterCountReset,
} from "./actionts"
import { getCounterCount } from "./selectors"

export const counterIncrementedEpic = (action$: Observable<StateAction>, state$: StateObservable<StateObject>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_INCREMENTED),
        switchMap(() => {
            const current = getCounterCount(state$.value)
            return [createActionCounterCountChanged(current + 1)]
        }),
    )

export const counterDecreasedEpic = (action$: Observable<StateAction>, state$: StateObservable<StateObject>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_DECREASED),
        switchMap(() => {
            const current = getCounterCount(state$.value)
            return [createActionCounterCountChanged(current - 1)]
        }),
    )

export const counterResetEpic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_RESET),
        switchMap(() => {
            return [createActionCounterCountChanged(0)]
        }),
    )
export const counterResetRequestedEpic = (action$: Observable<StateAction>, state$: StateObservable<StateObject>) =>
    action$.pipe(
        ofType(COUNTER_COUNT_RESET_REQUESTED),
        filterWithSelector(pipe(isCounterClientRunning, not), state$),
        switchMap(() => {
            return [createActionCounterCountReset()]
        }),
    )

export const counterAutoIncrementEpic = (action$: Observable<StateAction>) =>
    action$.pipe(
        ofType(COUNTER_AUTO_INCREMENT_STARTED),
        switchMap(() => {
            return interval(1000).pipe(
                takeUntil(action$.pipe(ofType(COUNTER_AUTO_INCREMENT_STOPPED))),
                switchMap(() => {
                    return [createActionCounterCountIncremented()]
                }),
            )
        }),
    )

export default [
    counterIncrementedEpic,
    counterDecreasedEpic,
    counterResetEpic,
    counterResetRequestedEpic,
    counterAutoIncrementEpic,
]
