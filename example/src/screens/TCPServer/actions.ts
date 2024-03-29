import { Maybe } from "../../types"
import { MessageData } from "../../common/components/messaging/types"
import { ServerConnectionState } from "../../common/types"

export const BARE_TCP_SERVER_START_REQUESTED = "BARE_TCP_SERVER_START_REQUESTED"
export const createActionBareTcpServerStartRequested = (port: string) => ({
    type: BARE_TCP_SERVER_START_REQUESTED,
    payload: {
        port: port,
    },
})

export const BARE_TCP_SERVER_START_SUCCEEDED = "BARE_TCP_SERVER_START_SUCCEEDED"
export const createActionBareTcpServerStartSucceeded = () => ({
    type: BARE_TCP_SERVER_START_SUCCEEDED,
})

export const BARE_TCP_SERVER_START_FAILED = "BARE_TCP_SERVER_START_FAILED"
export const createActionBareTcpServerStartFailed = (error: string) => ({
    type: BARE_TCP_SERVER_START_FAILED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_ERRORED = "BARE_TCP_SERVER_START_ERRORED"
export const createActionBareTcpServerErrored = (error: string) => ({
    type: BARE_TCP_SERVER_ERRORED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_READY = "BARE_TCP_SERVER_READY"
export const createActionBareTcpServerReady = (port: number) => ({
    type: BARE_TCP_SERVER_READY,
    payload: {
        port: port,
    },
})

export const BARE_TCP_SERVER_STOPPED = "BARE_TCP_SERVER_STOPPED"
export const createActionBareTcpServerStopped = (error: Maybe<string>) => ({
    type: BARE_TCP_SERVER_STOPPED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_SERVER_STOP_REQUESTED = "BARE_TCP_SERVER_STOP_REQUESTED"
export const createActionBareTcpServerStopRequested = () => ({
    type: BARE_TCP_SERVER_STOP_REQUESTED,
})

export const BARE_TCP_SERVER_CONNECTION_STATE_CHANGED = "BARE_TCP_SERVER_CONNECTION_STATE_CHANGED"
export const createActionBareTcpServerConnectionStateChanged = (
    connectionId: string,
    state: ServerConnectionState
) => ({
    type: BARE_TCP_SERVER_CONNECTION_STATE_CHANGED,
    payload: {
        connectionId: connectionId,
        state: state,
    },
})

export const BARE_TCP_SERVER_CONNECTION_NEW_DATA = "BARE_TCP_SERVER_CONNECTION_NEW_DATA"
export const createActionBareTcpServerConnectionNewData = (connectionId: string, data: MessageData) => ({
    type: BARE_TCP_SERVER_CONNECTION_NEW_DATA,
    payload: {
        connectionId: connectionId,
        data: data,
    },
})

export const BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED = "BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED"
export const createActionBareTcpServerActiveConnectionChanged = (connectionId: string) => ({
    type: BARE_TCP_SERVER_ACTIVE_CONNECTION_CHANGED,
    payload: {
        connectionId: connectionId,
    },
})

export const BARE_TCP_SERVER_DATA_SEND_REQUESTED = "BARE_TCP_SERVER_DATA_SEND_REQUESTED"
export const createActionBareTcpServerDataSendRequested = (connectionId: string, data: string) => ({
    type: BARE_TCP_SERVER_DATA_SEND_REQUESTED,
    payload: {
        connectionId: connectionId,
        data: data,
    },
})

export const BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED = "BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED"
export const createActionBareTcpServerCloseConnectionRequested = (connectionId: string) => ({
    type: BARE_TCP_SERVER_CLOSE_CONNECTION_REQUESTED,
    payload: {
        connectionId: connectionId,
    },
})
