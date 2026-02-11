import { MessageData } from "./types"

export const createMessageData = (from: MessageData["from"], data: string): MessageData => ({
    from: from,
    data: data,
    timestamp: new Date().toISOString(),
})
