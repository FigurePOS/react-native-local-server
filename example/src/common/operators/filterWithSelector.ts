import { StateObject } from "../../rootReducer"
import { StateObservable } from "redux-observable"
import { filter } from "rxjs/operators"

export const filterWithSelector = <T>(
    selector: (state: StateObject) => boolean,
    state$: StateObservable<StateObject>
) => filter<T>(() => selector(state$.value))
