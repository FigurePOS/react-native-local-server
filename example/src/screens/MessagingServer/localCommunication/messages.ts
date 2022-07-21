export enum LocalCommunicationMessageType {
    TextMessageSent = "TEXT_MESSAGE_SENT",
    ReplyTextMessageSent = "REPLY_TEXT_MESSAGE_SENT",
}

export type LocalCommunicationTextMessageSent = {
    type: LocalCommunicationMessageType.TextMessageSent
    payload: {
        id: string
        text: string
        timestamp: string
    }
}

export const createMessageTextMessageSent = (text: string): LocalCommunicationTextMessageSent => ({
    type: LocalCommunicationMessageType.TextMessageSent,
    payload: {
        id: "", // TODO
        text: text,
        timestamp: new Date().toISOString(),
    },
})

export type LocalCommunicationReplyTextMessageSent = {
    type: LocalCommunicationMessageType.ReplyTextMessageSent
    payload: {
        id: string
        replyId: string
        text: string
        timestamp: string
    }
}

export const createMessageReplyTextMessageSent = (
    text: string,
    replyId: string
): LocalCommunicationReplyTextMessageSent => ({
    type: LocalCommunicationMessageType.ReplyTextMessageSent,
    payload: {
        id: "", // TODO
        replyId: replyId,
        text: text,
        timestamp: new Date().toISOString(),
    },
})

export type LocalCommunicationMessage = LocalCommunicationTextMessageSent | LocalCommunicationReplyTextMessageSent
