import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMessagingClientData } from "../selectors"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { createActionMessagingClientDataSendRequested } from "../actions"
import { MessageControl } from "../../../common/components/messaging/MessageControl"

// 70 90
export const MessagingClientData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getMessagingClientData)
    return (
        <MessageView data={data}>
            <MessageControl onSent={(d) => dispatch(createActionMessagingClientDataSendRequested(d))} />
        </MessageView>
    )
}
