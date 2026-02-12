import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"

export type SampleMessagingClientDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}
