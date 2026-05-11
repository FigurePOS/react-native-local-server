import { merge } from "rxjs"

import { MessageHandler } from "../types"

export const combineHandlers = <In, Deps, Result>(
    ...handlers: MessageHandler<In, Deps, Result>[]
): MessageHandler<In, Deps, Result> => {
    return (...args: Parameters<MessageHandler<In, Deps, Result>>) =>
        merge(
            ...handlers.map((handler) => {
                return handler(...args)
            }),
        )
}
