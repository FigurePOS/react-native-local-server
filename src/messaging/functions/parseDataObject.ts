import { TCPClientDataReceivedNativeEvent, TCPServerDataReceivedNativeEvent } from "../../"
import { ErrorWithMetadata } from "../../utils/errors"
import { DataObject } from "../types"

export const parseDataObject = (
    nativeEvent: TCPClientDataReceivedNativeEvent | TCPServerDataReceivedNativeEvent,
): DataObject => {
    try {
        return {
            ...JSON.parse(nativeEvent.data),
            ...("connectionId" in nativeEvent ? { connectionId: nativeEvent.connectionId } : null),
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        throw new ErrorWithMetadata(message, {
            data: nativeEvent.data,
        })
    }
}
