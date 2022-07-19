import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent } from "../../tcp/client/nativeEvents"

export const parseDataObject = (nativeEvent: TCPClientDataReceivedNativeEvent): DataObject => {
    return JSON.parse(nativeEvent.data)
}
