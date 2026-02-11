import { merge } from "rxjs"

import { MessageHandler } from "../.."

export const combineHandlers = (...handlers: MessageHandler<unknown>[]): MessageHandler<unknown> => {
    return (...args: Parameters<MessageHandler<unknown>>) =>
        merge(
            ...handlers.map((handler) => {
                return handler(...args)
            }),
        )
}
