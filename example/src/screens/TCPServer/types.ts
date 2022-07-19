export enum TCPServerState {
    StandBy = "Stand-By",
    Ready = "Ready",
    Starting = "Starting",
    ShuttingDown = "Shutting Down",
    Error = "Error",
}

export enum TCPServerConnectionState {
    Accepted = "Accepted",
    Ready = "Ready",
    Closing = "Closing",
    Closed = "Closed",
    Error = "Error",
}

export type TCPServerConnectionData = {
    from: "server" | "client" | "status"
    timestamp: string
    data: string
}
