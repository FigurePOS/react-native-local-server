import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPClientData } from "../selectors"
import { createActionBareTcpClientDataSendRequested } from "../actions"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { MessageControl } from "../../../common/components/messaging/MessageControl"

// 70 90
export const TCPClientData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getBareTCPClientData)
    return (
        <MessageView data={data}>
            <MessageControl onSent={(d) => dispatch(createActionBareTcpClientDataSendRequested(d))} />
        </MessageView>
    )
}
