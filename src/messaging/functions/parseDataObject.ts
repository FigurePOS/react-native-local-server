import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent, TCPServerDataReceivedNativeEvent } from "../../"
import { MessagingServerMessageAdditionalInfo } from "../server/types"

export const parseDataObject = (
    nativeEvent: TCPClientDataReceivedNativeEvent | TCPServerDataReceivedNativeEvent
): DataObject => {
    return JSON.parse(nativeEvent.data)
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
