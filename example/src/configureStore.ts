import { applyMiddleware, createStore, Middleware, Store } from "redux"
import { createLogger } from "redux-logger"
import { createEpicMiddleware } from "redux-observable"

import { rootEpic } from "./rootEpic"
import { rootReducer } from "./rootReducer"

const configureStore = (): Store => {
    const epicMiddleware = createEpicMiddleware()
    const middlewares: Middleware[] = [epicMiddleware]

    const middleware = applyMiddleware(...middlewares)
    if (__DEV__) {
        // eslint-disable-next-line functional/immutable-data
        middlewares.push(createLogger({ collapsed: true, diff: true }))
    }

    const store: Store = createStore(rootReducer, middleware)
    epicMiddleware.run(rootEpic)

    return store
}

export const store = configureStore()
