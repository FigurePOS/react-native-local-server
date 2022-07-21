import { Message } from "../types"
import * as uuid from "uuid"

export const composeMessageObject = <B = any>(body: B, id: string = uuid.v4()): Message<B> => ({
    id: id,
    timestamp: new Date().toISOString(),
    body: body,
    source: {},
})
