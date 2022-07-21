import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ServerConfiguration } from "../../../common/components/configuration/ServerConfiguration"
import { getMessagingServerPort, getMessagingServerStateLabel, isMessagingServerRunning } from "../selectors"
import { createActionMessagingServerStartRequested, createActionMessagingServerStopRequested } from "../actions"

export const MessagingServerConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getMessagingServerStateLabel)
    const isRunning = useSelector(isMessagingServerRunning)
    const reduxPort = useSelector(getMessagingServerPort)
    return (
        <ServerConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            initialPort={reduxPort ?? ""}
            onStarted={(port) => dispatch(createActionMessagingServerStartRequested(port))}
            onStopped={() => dispatch(createActionMessagingServerStopRequested())}
        />
    )
}
