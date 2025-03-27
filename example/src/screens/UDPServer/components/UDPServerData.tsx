import React, { useCallback } from "react"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { useDispatch, useSelector } from "react-redux"
import { getBareUDPServerData } from "../selectors"
import { MessageControlEnhanced } from "../../../common/components/messaging/MessageControlEnhanced"
import { createActionBareUdpServerDataSendRequested } from "../actions"

export const BareUDPServerData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getBareUDPServerData)
    const onSent = useCallback(
        (host: string, port: number, d: string) => {
            dispatch(createActionBareUdpServerDataSendRequested(host, port, d))
        },
        [dispatch],
    )
    return (
        <MessageView data={data}>
            <MessageControlEnhanced onSent={onSent} />
        </MessageView>
    )
}
