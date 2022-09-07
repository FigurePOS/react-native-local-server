import { DataObjectMessage, Message } from "../types"
import { ErrorWithMetadata } from "../../utils/errors"

export const parseMessage = <B = any>(data: DataObjectMessage): Message<B> => {
    return data.message
}

export const parseClientMessage = <B = any>(data: DataObjectMessage): Message<B> => {
    return parseMessage(data)
}

export const parseServerMessage = <B = any>(data: DataObjectMessage): Message<B> => {
    if (data.connectionId == null) {
        throw new ErrorWithMetadata("parseServerMessage - connection id is missing")
    }
    const parsed = parseMessage(data)
    return {
        ...parsed,
        source: {
            ...parsed.source,
            connectionId: data.connectionId,
        },
    }
}
