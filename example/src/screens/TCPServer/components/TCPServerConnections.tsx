import React from "react"
import { getBareTCPServerActiveConnectionId, getBareTCPServerConnections } from "../selectors"
import { useDispatch, useSelector } from "react-redux"
import { Maybe } from "../../../types"
import { ConnectionRow } from "../../../common/components/messaging/ConnectionRow"
import {
    createActionBareTcpServerActiveConnectionChanged,
    createActionBareTcpServerCloseConnectionRequested,
} from "../actions"
import { ServerConnection } from "../../../common/types"

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
