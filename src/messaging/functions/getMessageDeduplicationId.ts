import { Message } from "../types"

export const getMessageDeduplicationId = <T>(message: Message<T>): string | null =>
    message.attributes?.deduplicationId ?? null
