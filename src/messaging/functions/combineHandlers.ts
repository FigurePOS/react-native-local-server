import { MessageHandler } from "../.."
import { merge } from "rxjs"
import { ServerMessageHandler } from "../types"

export const combineHandlers = (...handlers: MessageHandler<any>[]): MessageHandler<any> => {
    return (...args: Parameters<MessageHandler<any>>) =>
        merge(
            ...handlers.map((handler) => {
                return handler(...args)
            })
        )
}

export const combineServerHandlers = (...handlers: ServerMessageHandler<any>[]): ServerMessageHandler<any> => {
    return (...args: Parameters<ServerMessageHandler<any>>) =>
        merge(
            ...handlers.map((handler) => {
                return handler(...args)
            })
        )
}
