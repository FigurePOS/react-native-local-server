import { store } from "../../../configureStore"
import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"

export type CounterDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const CounterDependencies: CounterDependenciesType = {
    getState: store.getState,
    dispatch: store.dispatch,
}
