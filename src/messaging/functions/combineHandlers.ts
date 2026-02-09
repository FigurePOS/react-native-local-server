import { merge } from "rxjs"

import { MessageHandler } from "../.."

export const combineHandlers = (...handlers: MessageHandler<any>[]): MessageHandler<any> => {
    return (...args: Parameters<MessageHandler<any>>) =>
        merge(
            ...handlers.map((handler) => {
                return handler(...args)
            }),
        )
}
