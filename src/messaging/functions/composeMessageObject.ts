import { Message, MessageSource } from "../types"
import * as uuid from "uuid"

export const composeMessageObject = <B = any>(body: B, source: MessageSource): Message<B> => ({
    id: uuid.v4(),
    timestamp: new Date().toISOString(),
    body: body,
    source: source,
})
