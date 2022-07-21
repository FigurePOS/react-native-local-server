import { DataObjectMessage, Message } from "../types"
import { MessagingServerMessageAdditionalInfo } from "../server/types"

export const parseMessage = <B = any>(data: DataObjectMessage): Message<B> => {
    return data.message
}

export const parseClientMessage = <B = any>([data, _]: [DataObjectMessage, null]): [Message<B>, null] => {
    return [parseMessage(data), null]
}

export const parseServerMessage = <B = any>([data, info]: [DataObjectMessage, MessagingServerMessageAdditionalInfo]): [
    Message<B>,
    MessagingServerMessageAdditionalInfo
] => {
    const parsed = parseMessage(data)
    const message: Message<B> = {
        ...parsed,
        source: {
            ...parsed.source,
            connectionId: info.connectionId,
        },
    }
    return [message, info]
}
