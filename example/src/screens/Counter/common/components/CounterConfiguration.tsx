import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { DoubleConfiguration } from "../../../../common/components/configuration/DoubleConfiguration"
import {
    createActionCounterServerRestartRequested,
    createActionCounterServerStartRequested,
    createActionCounterServerStopRequested,
} from "../../server/actions"
import {
    getCounterServerIpAddress,
    getCounterServerPort,
    getCounterServerStateLabel,
    isCounterServerRunning,
} from "../../server/selectors"
import {
    getCounterClientHost,
    getCounterClientPort,
    getCounterClientStateLabel,
    isCounterClientRunning,
} from "../../client/selectors"
import {
    createActionCounterClientRestartRequested,
    createActionCounterClientStartRequested,
    createActionCounterClientStopRequested,
} from "../../client/actions"

export const CounterConfiguration = () => {
    const dispatch = useDispatch()
    const serverLabel = useSelector(getCounterServerStateLabel)
    const serverPort = useSelector(getCounterServerPort)
    const serverIp = useSelector(getCounterServerIpAddress)
    const isServerRunning = useSelector(isCounterServerRunning)

    const clientLabel = useSelector(getCounterClientStateLabel)
    const clientPort = useSelector(getCounterClientPort)
    const clientHost = useSelector(getCounterClientHost)
    const isClientRunning = useSelector(isCounterClientRunning)
    return (
        <DoubleConfiguration
            stateLabelServer={serverLabel}
            initialPortServer={serverPort ?? ""}
            ipAddressServer={serverIp}
            stateLabelClient={clientLabel}
            initialPortClient={clientPort ?? ""}
            initialHostClient={clientHost ?? ""}
            isRunning={isServerRunning || isClientRunning}
            onClientStarted={(host, port) => dispatch(createActionCounterClientStartRequested(host, port))}
            onClientStopped={() => dispatch(createActionCounterClientStopRequested())}
            onClientRestarted={() => dispatch(createActionCounterClientRestartRequested())}
            onServerStarted={(port) => dispatch(createActionCounterServerStartRequested(port))}
            onServerStopped={() => dispatch(createActionCounterServerStopRequested())}
            onServerRestarted={() => dispatch(createActionCounterServerRestartRequested())}
        />
    )
}
