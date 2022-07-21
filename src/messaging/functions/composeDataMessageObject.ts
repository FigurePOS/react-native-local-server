import { DataObjectMessage, DataObjectType, Message } from "../types"

export const composeDataMessageObject = (msg: Message): DataObjectMessage => ({
    type: DataObjectType.Message,
    message: msg,
})
