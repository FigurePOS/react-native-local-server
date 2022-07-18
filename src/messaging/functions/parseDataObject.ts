import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent } from "../../tcp/client/types"

export const parseDataObject = (nativeEvent: TCPClientDataReceivedNativeEvent): DataObject => {
    return JSON.parse(nativeEvent.data)
}
