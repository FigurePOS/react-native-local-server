import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    getBareTCPClientHost,
    getBareTCPClientPort,
    getBareTCPClientStateLabel,
    isBareTCPClientRunning,
} from "../selectors"
import { createActionBareTcpClientStartRequested, createActionBareTcpClientStopRequested } from "../actions"
import { ClientConfiguration } from "../../../common/components/configuration/ClientConfiguration"

export const TCPClientConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getBareTCPClientStateLabel)
    const isRunning = useSelector(isBareTCPClientRunning)
    const reduxPort = useSelector(getBareTCPClientPort)
    const reduxHost = useSelector(getBareTCPClientHost)
    return (
        <ClientConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            initialPort={reduxPort ?? ""}
            initialHost={reduxHost ?? ""}
            onStarted={(host, port) => dispatch(createActionBareTcpClientStartRequested(host, port))}
            onStopped={() => dispatch(createActionBareTcpClientStopRequested())}
        />
    )
}
