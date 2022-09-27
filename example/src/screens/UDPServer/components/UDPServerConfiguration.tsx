import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { createActionBareUdpServerStartRequested, createActionBareUdpServerStopRequested } from "../actions"
import { getBareUDPServerPort, getBareUDPServerStateLabel, isBareUDPServerRunning } from "../selectors"
import { ServerConfiguration } from "../../../common/components/configuration/ServerConfiguration"

export const UDPServerConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getBareUDPServerStateLabel)
    const isRunning = useSelector(isBareUDPServerRunning)
    const reduxPort = useSelector(getBareUDPServerPort)
    return (
        <ServerConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            ipAddress={"TODO"}
            initialPort={reduxPort ?? ""}
            onStarted={(port) => dispatch(createActionBareUdpServerStartRequested(port))}
            onStopped={() => dispatch(createActionBareUdpServerStopRequested())}
        />
    )
}
