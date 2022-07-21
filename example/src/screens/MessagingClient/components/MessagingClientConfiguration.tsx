import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    getMessagingClientHost,
    getMessagingClientPort,
    getMessagingClientStateLabel,
    isMessagingClientRunning,
} from "../selectors"
import { createActionMessagingClientStartRequested, createActionMessagingClientStopRequested } from "../actions"
import { ClientConfiguration } from "../../../common/components/configuration/ClientConfiguration"

export const MessagingClientConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getMessagingClientStateLabel)
    const isRunning = useSelector(isMessagingClientRunning)
    const reduxPort = useSelector(getMessagingClientPort)
    const reduxHost = useSelector(getMessagingClientHost)
    return (
        <ClientConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            initialPort={reduxPort ?? ""}
            initialHost={reduxHost ?? ""}
            onStarted={(host, port) => dispatch(createActionMessagingClientStartRequested(host, port))}
            onStopped={() => dispatch(createActionMessagingClientStopRequested())}
        />
    )
}
