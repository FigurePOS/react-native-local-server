import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { ConnectionRow } from "../../../common/components/messaging/ConnectionRow"
import { ServerConnection } from "../../../common/types"
import { Maybe } from "../../../types"
import {
    createActionBareTcpServerActiveConnectionChanged,
    createActionBareTcpServerCloseConnectionRequested,
} from "../actions"
import { getBareTCPServerActiveConnectionId, getBareTCPServerConnections } from "../selectors"

export const TCPServerConnections = () => {
    const dispatch = useDispatch()
    const connections: ServerConnection[] = useSelector(getBareTCPServerConnections)
    const activeId: Maybe<string> = useSelector(getBareTCPServerActiveConnectionId)
    return (
        <ConnectionRow
            connections={connections}
            activeConnectionId={activeId}
            onConnectionPressed={(id: string) => dispatch(createActionBareTcpServerActiveConnectionChanged(id))}
            onConnectionClosePressed={(id: string) => dispatch(createActionBareTcpServerCloseConnectionRequested(id))}
        />
    )
}
