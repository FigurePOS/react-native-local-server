import { DataObject } from "../types"
import { TCPClientDataReceivedNativeEvent, TCPServerDataReceivedNativeEvent } from "../../"
import { ErrorWithMetadata } from "../../utils/errors"

export const parseDataObject = (
    nativeEvent: TCPClientDataReceivedNativeEvent | TCPServerDataReceivedNativeEvent
): DataObject => {
    try {
        return {
            ...JSON.parse(nativeEvent.data),
            ...("connectionId" in nativeEvent ? { connectionId: nativeEvent.connectionId } : null),
        }
    } catch (e: any) {
        throw new ErrorWithMetadata(e.message, {
            data: nativeEvent.data,
        })
    }
}
