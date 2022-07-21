import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"
import { store } from "../../../configureStore"

export type SampleMessagingClientDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const SampleMessagingClientDependencies: SampleMessagingClientDependenciesType = {
    getState: store.getState,
    dispatch: store.dispatch,
}
