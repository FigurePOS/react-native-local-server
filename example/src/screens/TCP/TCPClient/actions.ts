import { TCPClientState, TCPData } from "../common/types"

export const BARE_TCP_CLIENT_START_REQUESTED = "BARE_TCP_CLIENT_START_REQUESTED"
export const createActionBareTcpClientStartRequested = (host: string, port: string) => ({
    type: BARE_TCP_CLIENT_START_REQUESTED,
    payload: {
        host: host,
        port: port,
    },
})

export const BARE_TCP_CLIENT_STOP_REQUESTED = "BARE_TCP_CLIENT_STOP_REQUESTED"
export const createActionBareTcpClientStopRequested = () => ({
    type: BARE_TCP_CLIENT_STOP_REQUESTED,
})

export const BARE_TCP_CLIENT_ERRORED = "BARE_TCP_CLIENT_ERRORED"
export const createActionBareTcpClientErrored = (error: string) => ({
    type: BARE_TCP_CLIENT_ERRORED,
    payload: {
        error: error,
    },
})

export const BARE_TCP_CLIENT_STATE_CHANGED = "BARE_TCP_CLIENT_STATE_CHANGED"
export const createActionBareTcpClientStateChanged = (state: TCPClientState) => ({
    type: BARE_TCP_CLIENT_STATE_CHANGED,
    payload: {
        state: state,
    },
})

export const BARE_TCP_CLIENT_NEW_DATA = "BARE_TCP_CLIENT_NEW_DATA"
export const createActionBareTcpClientNewData = (data: TCPData) => ({
    type: BARE_TCP_CLIENT_NEW_DATA,
    payload: {
        data: data,
    },
})

export const BARE_TCP_CLIENT_DATA_SEND_REQUESTED = "BARE_TCP_CLIENT_DATA_SEND_REQUESTED"
export const createActionBareTcpClientDataSendRequested = (data: string) => ({
    type: BARE_TCP_CLIENT_DATA_SEND_REQUESTED,
    payload: {
        data: data,
    },
})
