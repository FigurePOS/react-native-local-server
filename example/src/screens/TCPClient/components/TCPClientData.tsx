import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPClientData } from "../selectors"
import { createActionBareTcpClientDataSendRequested } from "../actions"
import { MessageView } from "../../../common/components/messaging/MessageView"

// 70 90
export const TCPClientData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getBareTCPClientData)
    return <MessageView data={data} onSent={(d) => dispatch(createActionBareTcpClientDataSendRequested(d))} />
}
