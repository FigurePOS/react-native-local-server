import { ErrorWithMetadata } from "../../utils/errors"
import { DataObjectMessage, Message } from "../types"

export const parseMessage = (data: DataObjectMessage): Message => {
    return data.message
}

export const parseClientMessage = (data: DataObjectMessage): Message => {
    return parseMessage(data)
}

export const parseServerMessage = (data: DataObjectMessage): Message => {
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
