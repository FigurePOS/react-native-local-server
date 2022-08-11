import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent, TCPServerDataReceivedNativeEvent } from "../../"
import { MessagingServerMessageAdditionalInfo } from "../server/types"
import { ErrorWithMetadata } from "../../utils/errors"

export const parseDataObject = (
    nativeEvent: TCPClientDataReceivedNativeEvent | TCPServerDataReceivedNativeEvent
): DataObject => {
    try {
        return JSON.parse(nativeEvent.data)
    } catch (e: any) {
        throw new ErrorWithMetadata(e.message, {
            data: nativeEvent.data,
        })
    }
}

export const parseClientDataObject = (nativeEvent: TCPClientDataReceivedNativeEvent): [DataObject, null] => {
    return [parseDataObject(nativeEvent), null]
}

export const parseServerDataObject = (
    nativeEvent: TCPServerDataReceivedNativeEvent
): [DataObject, MessagingServerMessageAdditionalInfo] => {
    const info: MessagingServerMessageAdditionalInfo = {
        connectionId: nativeEvent.connectionId,
    }
    return [parseDataObject(nativeEvent), info]
}
