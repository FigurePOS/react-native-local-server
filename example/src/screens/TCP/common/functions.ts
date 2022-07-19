import { TCPData } from "./types"

export const createTCPRowData = (from: TCPData["from"], data: string): TCPData => ({
    from: from,
    data: data,
    timestamp: new Date().toISOString(),
})
