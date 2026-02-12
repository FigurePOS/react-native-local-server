import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { ConnectionRow } from "../../../common/components/messaging/ConnectionRow"
import { ServerConnection } from "../../../common/types"
import { Maybe } from "../../../types"
import {
    createActionMessagingServerActiveConnectionChanged,
    createActionMessagingServerConnectionCloseRequested,
} from "../actions"
import { getMessagingServerActiveConnectionId, getMessagingServerConnections } from "../selectors"

export const MessagingServerConnections = () => {
    const dispatch = useDispatch()
    const connections: ServerConnection[] = useSelector(getMessagingServerConnections)
    const activeId: Maybe<string> = useSelector(getMessagingServerActiveConnectionId)
    return (
        <ConnectionRow
            connections={connections}
            activeConnectionId={activeId}
            onConnectionPressed={(id: string) => dispatch(createActionMessagingServerActiveConnectionChanged(id))}
            onConnectionClosePressed={(id: string) => dispatch(createActionMessagingServerConnectionCloseRequested(id))}
        />
    )
}
