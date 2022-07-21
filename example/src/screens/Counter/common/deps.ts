import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"
import { store } from "../../../configureStore"

export type CounterDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const CounterDependencies: CounterDependenciesType = {
    getState: store.getState,
    dispatch: store.dispatch,
}
