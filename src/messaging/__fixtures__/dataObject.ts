import { DataObjectMessage, DataObjectMessageAck, DataObjectType } from "../types"

const now = "2020-01-01T00:00:00.000Z"

export const DataObjectMessageFixture1: DataObjectMessage = {
    type: DataObjectType.Message,
    message: {
        id: "message-1",
        timestamp: now,
        source: {
            connectionId: "connection-1",
        },
        body: {},
    },
}
export const DataObjectMessageFixture2: DataObjectMessage = {
    type: DataObjectType.Message,
    message: {
        id: "message-2",
        timestamp: now,
        source: {
            connectionId: "connection-1",
        },
        body: {},
    },
}
export const DataObjectMessageFixture3: DataObjectMessage = {
    type: DataObjectType.Message,
    message: {
        id: "message-3",
        timestamp: now,
        source: {
            connectionId: "connection-1",
        },
        body: {},
    },
}

export const DataObjectMessageAckFixture1: DataObjectMessageAck = {
    type: DataObjectType.MessageAck,
    messageId: DataObjectMessageFixture1.message.id,
}

export const DataObjectMessageAckFixture2: DataObjectMessageAck = {
    type: DataObjectType.MessageAck,
    messageId: DataObjectMessageFixture2.message.id,
}

export const DataObjectMessageAckFixture3: DataObjectMessageAck = {
    type: DataObjectType.MessageAck,
    messageId: DataObjectMessageFixture3.message.id,
}
