import { ClientState } from "../../common/types"
import { MessageData } from "../../common/components/messaging/types"

export const MESSAGING_CLIENT_START_REQUESTED = "MESSAGING_CLIENT_START_REQUESTED"
export const createActionMessagingClientStartRequested = (host: string, port: string) => ({
    type: MESSAGING_CLIENT_START_REQUESTED,
    payload: {
        host: host,
        port: port,
    },
})

export const MESSAGING_CLIENT_STOP_REQUESTED = "MESSAGING_CLIENT_STOP_REQUESTED"
export const createActionMessagingClientStopRequested = () => ({
    type: MESSAGING_CLIENT_STOP_REQUESTED,
})

export const MESSAGING_CLIENT_ERRORED = "MESSAGING_CLIENT_ERRORED"
export const createActionMessagingClientErrored = (error: string) => ({
    type: MESSAGING_CLIENT_ERRORED,
    payload: {
        error: error,
    },
})

export const MESSAGING_CLIENT_STATE_CHANGED = "MESSAGING_CLIENT_STATE_CHANGED"
export const createActionMessagingClientStateChanged = (state: ClientState) => ({
    type: MESSAGING_CLIENT_STATE_CHANGED,
    payload: {
        state: state,
    },
})

export const MESSAGING_CLIENT_DATA_RECEIVED = "MESSAGING_CLIENT_DATA_RECEIVED"
export const createActionMessagingClientDataReceived = (data: MessageData) => ({
    type: MESSAGING_CLIENT_DATA_RECEIVED,
    payload: {
        data: data,
    },
})

export const MESSAGING_CLIENT_DATA_SEND_REQUESTED = "MESSAGING_CLIENT_DATA_SEND_REQUESTED"
export const createActionMessagingClientDataSendRequested = (data: string) => ({
    type: MESSAGING_CLIENT_DATA_SEND_REQUESTED,
    payload: {
        data: data,
    },
})
