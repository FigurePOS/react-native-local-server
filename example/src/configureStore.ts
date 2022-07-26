import { createLogger } from "redux-logger"
import { applyMiddleware, createStore, Middleware, Store } from "redux"
import { createEpicMiddleware } from "redux-observable"
import { rootReducer } from "./rootReducer"
import { rootEpic } from "./rootEpic"

const configureStore = (): Store => {
    const epicMiddleware = createEpicMiddleware()
    const middlewares: Middleware[] = [epicMiddleware]

    let middleware
    if (__DEV__) {
        middlewares.push(createLogger({ collapsed: true, diff: true }))
    }
    middleware = applyMiddleware(...middlewares)

    const store: Store = createStore(rootReducer, middleware)
    epicMiddleware.run(rootEpic)

    return store
}

export const store = configureStore()
