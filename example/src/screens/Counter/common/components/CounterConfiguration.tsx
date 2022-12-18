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
    getCounterClientAvailableServices,
    getCounterClientHost,
    getCounterClientPort,
    getCounterClientSearchStateLabel,
    getCounterClientStateLabel,
    isCounterClientRunning,
} from "../../client/selectors"
import {
    createActionCounterClientRestartRequested,
    createActionCounterClientSearchRestartRequested,
    createActionCounterClientSearchStartRequested,
    createActionCounterClientSearchStopRequested,
    createActionCounterClientStartFromServiceRequested,
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

    const searchLabel = useSelector(getCounterClientSearchStateLabel)
    const services = useSelector(getCounterClientAvailableServices)
    return (
        <DoubleConfiguration
            stateLabelServer={serverLabel}
            initialPortServer={serverPort ?? ""}
            ipAddressServer={serverIp}
            stateLabelClient={clientLabel}
            initialPortClient={clientPort ?? ""}
            initialHostClient={clientHost ?? ""}
            stateLabelSearch={searchLabel}
            searchServices={services}
            isRunning={isServerRunning || isClientRunning}
            onClientStarted={(host, port) => dispatch(createActionCounterClientStartRequested(host, port))}
            onClientStopped={() => dispatch(createActionCounterClientStopRequested())}
            onClientRestarted={() => dispatch(createActionCounterClientRestartRequested())}
            onServerStarted={(port) => dispatch(createActionCounterServerStartRequested(port))}
            onServerStopped={() => dispatch(createActionCounterServerStopRequested())}
            onServerRestarted={() => dispatch(createActionCounterServerRestartRequested())}
            onSearchStarted={() => dispatch(createActionCounterClientSearchStartRequested())}
            onSearchStopped={() => dispatch(createActionCounterClientSearchStopRequested())}
            onSearchRestarted={() => dispatch(createActionCounterClientSearchRestartRequested())}
            onSearchServiceSelected={(id) => dispatch(createActionCounterClientStartFromServiceRequested(id))}
        />
    )
}
