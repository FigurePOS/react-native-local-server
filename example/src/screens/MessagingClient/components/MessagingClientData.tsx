import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMessagingClientData } from "../selectors"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { createActionMessagingClientDataSendRequested } from "../actions"

// 70 90
export const MessagingClientData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getMessagingClientData)
    return <MessageView data={data} onSent={(d) => dispatch(createActionMessagingClientDataSendRequested(d))} />
}
