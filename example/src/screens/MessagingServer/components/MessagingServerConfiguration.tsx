import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { ServerConfiguration } from "../../../common/components/configuration/ServerConfiguration"
import { createActionMessagingServerStartRequested, createActionMessagingServerStopRequested } from "../actions"
import { getMessagingServerPort, getMessagingServerStateLabel, isMessagingServerRunning } from "../selectors"

export const MessagingServerConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getMessagingServerStateLabel)
    const isRunning = useSelector(isMessagingServerRunning)
    const reduxPort = useSelector(getMessagingServerPort)
    return (
        <ServerConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            ipAddress={"TODO"}
            initialPort={reduxPort ?? ""}
            onStarted={(port) => dispatch(createActionMessagingServerStartRequested(port))}
            onStopped={() => dispatch(createActionMessagingServerStopRequested())}
        />
    )
}
