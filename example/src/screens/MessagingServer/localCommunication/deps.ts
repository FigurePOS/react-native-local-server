import { store } from "../../../configureStore"
import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"

export type SampleMessagingServerDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const SampleMessagingServerDependencies: SampleMessagingServerDependenciesType = {
    getState: store.getState,
    dispatch: store.dispatch,
}
