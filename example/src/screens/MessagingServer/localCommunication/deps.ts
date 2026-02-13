import { StateObject } from "../../../rootReducer"
import { StateAction } from "../../../types"

export type SampleMessagingServerDependenciesType = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}
