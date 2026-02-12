import { applyMiddleware, createStore, Middleware, Store } from "redux"
import { createLogger } from "redux-logger"
import { createEpicMiddleware } from "redux-observable"

import { rootEpic } from "./rootEpic"
import { rootReducer, StateObject } from "./rootReducer"
import { StateAction } from "./types"

export type EpicDependencies = {
    getState: () => StateObject
    dispatch: (action: StateAction) => void
}

export const configureStore = (): Store => {
    const epicDependencies: EpicDependencies = {
        getState: () => store.getState(),
        dispatch: (action: StateAction) => store.dispatch(action),
    }

    const epicMiddleware = createEpicMiddleware({
        dependencies: epicDependencies,
    })

    const middlewares: Middleware[] = [epicMiddleware]

    if (__DEV__) {
        // eslint-disable-next-line functional/immutable-data
        middlewares.push(createLogger({ collapsed: true, diff: true }))
    }

    const middleware = applyMiddleware(...middlewares)

    const store: Store = createStore(rootReducer, middleware)

    epicMiddleware.run(rootEpic)

    return store
}

export const store = configureStore()
