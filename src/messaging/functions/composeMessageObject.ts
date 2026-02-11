import * as uuid from "uuid"

import { Message, MessageSource } from "../types"

export const composeMessageObject = <B = unknown>(body: B, source: MessageSource): Message<B> => ({
    id: uuid.v4(),
    timestamp: new Date().toISOString(),
    body: body,
    source: source,
})
