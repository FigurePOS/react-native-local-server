import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent, TCPServerDataReceivedNativeEvent } from "../../"

export const parseDataObject = (
    nativeEvent: TCPClientDataReceivedNativeEvent | TCPServerDataReceivedNativeEvent
): DataObject => {
    return JSON.parse(nativeEvent.data)
}
