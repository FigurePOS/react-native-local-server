import React from "react"
import { getMessagingServerActiveConnectionId, getMessagingServerConnections } from "../selectors"
import { useDispatch, useSelector } from "react-redux"
import { Maybe } from "../../../types"
import { ConnectionRow } from "../../../common/components/messaging/ConnectionRow"
import { createActionMessagingServerActiveConnectionChanged } from "../actions"
import { ServerConnection } from "../../../common/types"

export const MessagingServerConnections = () => {
    const dispatch = useDispatch()
    const connections: ServerConnection[] = useSelector(getMessagingServerConnections)
    const activeId: Maybe<string> = useSelector(getMessagingServerActiveConnectionId)
    return (
        <ConnectionRow
            connections={connections}
            activeConnectionId={activeId}
            onConnectionPressed={(id: string) => dispatch(createActionMessagingServerActiveConnectionChanged(id))}
        />
    )
}
