import { ServerConnectionState, ServerState } from "../../common/types"
import { MessageData } from "../../common/components/messaging/types"

export const MESSAGING_SERVER_START_REQUESTED = "MESSAGING_SERVER_START_REQUESTED"
export const createActionMessagingServerStartRequested = (port: string) => ({
    type: MESSAGING_SERVER_START_REQUESTED,
    payload: {
        port: port,
    },
})

export const MESSAGING_SERVER_STOP_REQUESTED = "MESSAGING_SERVER_STOP_REQUESTED"
export const createActionMessagingServerStopRequested = () => ({
    type: MESSAGING_SERVER_STOP_REQUESTED,
})

export const MESSAGING_SERVER_SEND_MESSAGE_REQUESTED = "MESSAGING_SERVER_SEND_MESSAGE_REQUESTED"
export const createActionMessagingServerSendMessageRequested = (connectionId: string, data: string) => ({
    type: MESSAGING_SERVER_SEND_MESSAGE_REQUESTED,
    payload: {
        connectionId: connectionId,
        data: data,
    },
})

export const MESSAGING_SERVER_ACTIVE_CONNECTION_CHANGED = "MESSAGING_SERVER_ACTIVE_CONNECTION_CHANGED"
export const createActionMessagingServerActiveConnectionChanged = (connectionId: string) => ({
    type: MESSAGING_SERVER_ACTIVE_CONNECTION_CHANGED,
    payload: {
        connectionId: connectionId,
    },
})

export const MESSAGING_SERVER_STATE_CHANGED = "MESSAGING_SERVER_STATE_CHANGED"
export const createActionMessagingServerStateChanged = (state: ServerState) => ({
    type: MESSAGING_SERVER_STATE_CHANGED,
    payload: {
        state: state,
    },
})

export const MESSAGING_SERVER_ERRORED = "MESSAGING_SERVER_ERRORED"
export const createActionMessagingServerErrored = (error: string) => ({
    type: MESSAGING_SERVER_ERRORED,
    payload: {
        error: error,
    },
})

export const MESSAGING_SERVER_CONNECTION_STATE_CHANGED = "MESSAGING_SERVER_CONNECTION_STATE_CHANGED"
export const createActionMessagingServerConnectionStateChanged = (
    connectionId: string,
    state: ServerConnectionState,
) => ({
    type: MESSAGING_SERVER_CONNECTION_STATE_CHANGED,
    payload: {
        connectionId: connectionId,
        state: state,
    },
})

export const MESSAGING_SERVER_CONNECTION_CLOSE_REQUESTED = "MESSAGING_SERVER_CONNECTION_CLOSE_REQUESTED"
export const createActionMessagingServerConnectionCloseRequested = (connectionId: string) => ({
    type: MESSAGING_SERVER_CONNECTION_CLOSE_REQUESTED,
    payload: {
        connectionId: connectionId,
    },
})

export const MESSAGING_SERVER_DATA_RECEIVED = "MESSAGING_SERVER_DATA_RECEIVED"
export const createActionMessagingServerDataReceived = (connectionId: string, data: MessageData) => ({
    type: MESSAGING_SERVER_DATA_RECEIVED,
    payload: {
        connectionId: connectionId,
        data: data,
    },
})
