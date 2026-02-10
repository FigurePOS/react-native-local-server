import { StateObservable } from "redux-observable"
import { filter } from "rxjs/operators"

import { StateObject } from "../../rootReducer"

export const filterWithSelector = <T>(
    selector: (state: StateObject) => boolean,
    state$: StateObservable<StateObject>,
) => filter<T>(() => selector(state$.value))
