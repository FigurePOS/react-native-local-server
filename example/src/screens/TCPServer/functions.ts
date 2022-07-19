import { TCPServerConnectionData } from "./types"

export const createTCPServerConnectionData = (
    from: TCPServerConnectionData["from"],
    data: string
): TCPServerConnectionData => ({
    from: from,
    data: data,
    timestamp: new Date().toISOString(),
})
