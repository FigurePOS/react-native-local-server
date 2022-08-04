import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { createActionBareTcpServerStartRequested, createActionBareTcpServerStopRequested } from "../actions"
import { getBareTCPServerPort, getBareTCPServerStateLabel, isBareTCPServerRunning } from "../selectors"
import { ServerConfiguration } from "../../../common/components/configuration/ServerConfiguration"

export const TCPServerConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getBareTCPServerStateLabel)
    const isRunning = useSelector(isBareTCPServerRunning)
    const reduxPort = useSelector(getBareTCPServerPort)
    return (
        <ServerConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            ipAddress={"TODO"}
            initialPort={reduxPort ?? ""}
            onStarted={(port) => dispatch(createActionBareTcpServerStartRequested(port))}
            onStopped={() => dispatch(createActionBareTcpServerStopRequested())}
        />
    )
}
