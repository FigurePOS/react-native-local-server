import { store } from "../../../configureStore"
import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"

export type SampleMessagingClientDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const SampleMessagingClientDependencies: SampleMessagingClientDependenciesType = {
    getState: store.getState,
    dispatch: store.dispatch,
}
