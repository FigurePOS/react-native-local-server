import { MessageData } from "../../common/components/messaging/types"
import { Maybe } from "../../types"

export const BARE_UDP_SERVER_START_REQUESTED = "BARE_UDP_SERVER_START_REQUESTED"
export const createActionBareUdpServerStartRequested = (port: string) => ({
    type: BARE_UDP_SERVER_START_REQUESTED,
    payload: {
        port: port,
    },
})

export const BARE_UDP_SERVER_START_SUCCEEDED = "BARE_UDP_SERVER_START_SUCCEEDED"
export const createActionBareUdpServerStartSucceeded = () => ({
    type: BARE_UDP_SERVER_START_SUCCEEDED,
})

export const BARE_UDP_SERVER_START_FAILED = "BARE_UDP_SERVER_START_FAILED"
export const createActionBareUdpServerStartFailed = (error: string) => ({
    type: BARE_UDP_SERVER_START_FAILED,
    payload: {
        error: error,
    },
})

export const BARE_UDP_SERVER_ERRORED = "BARE_UDP_SERVER_START_ERRORED"
export const createActionBareUdpServerErrored = (error: string) => ({
    type: BARE_UDP_SERVER_ERRORED,
    payload: {
        error: error,
    },
})

export const BARE_UDP_SERVER_READY = "BARE_UDP_SERVER_READY"
export const createActionBareUdpServerReady = () => ({
    type: BARE_UDP_SERVER_READY,
})

export const BARE_UDP_SERVER_STOPPED = "BARE_UDP_SERVER_STOPPED"
export const createActionBareUdpServerStopped = (error: Maybe<string>) => ({
    type: BARE_UDP_SERVER_STOPPED,
    payload: {
        error: error,
    },
})

export const BARE_UDP_SERVER_STOP_REQUESTED = "BARE_UDP_SERVER_STOP_REQUESTED"
export const createActionBareUdpServerStopRequested = () => ({
    type: BARE_UDP_SERVER_STOP_REQUESTED,
})

export const BARE_UDP_SERVER_DATA_RECEIVED = "BARE_UDP_SERVER_DATA_RECEIVED"
export const createActionBareUdpServerDataReceived = (data: MessageData) => ({
    type: BARE_UDP_SERVER_DATA_RECEIVED,
    payload: {
        data: data,
    },
})

export const BARE_UDP_SERVER_DATA_SEND_REQUESTED = "BARE_UDP_SERVER_DATA_SEND_REQUESTED"
export const createActionBareUdpServerDataSendRequested = (host: string, port: number, data: string) => ({
    type: BARE_UDP_SERVER_DATA_SEND_REQUESTED,
    payload: {
        host: host,
        port: port,
        data: data,
    },
})
