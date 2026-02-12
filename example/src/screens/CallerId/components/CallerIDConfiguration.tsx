import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { ServerConfiguration } from "../../../common/components/configuration/ServerConfiguration"
import { createActionCallerIdServerStartRequested, createActionCallerIdServerStopRequested } from "../actions"
import { getCallerIDServerStateLabel, isCallerIDServerRunning } from "../selectors"

export const CallerIDConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getCallerIDServerStateLabel)
    const isRunning = useSelector(isCallerIDServerRunning)
    return (
        <ServerConfiguration
            stateLabel={stateLabel}
            isRunning={isRunning}
            ipAddress={"TODO"}
            initialPort={null}
            onStarted={() => dispatch(createActionCallerIdServerStartRequested())}
            onStopped={() => dispatch(createActionCallerIdServerStopRequested())}
        />
    )
}
