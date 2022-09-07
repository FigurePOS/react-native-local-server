import { DataObjectMessage, DataObjectType, Message } from "../types"

export const composeDataMessageObject = (msg: Message, connectionId?: string): DataObjectMessage => ({
    type: DataObjectType.Message,
    message: msg,
    ...(connectionId ? { connectionId: connectionId } : null),
})
