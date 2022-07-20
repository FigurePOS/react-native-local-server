export enum ServerState {
    StandBy = "Stand-By",
    Ready = "Ready",
    Starting = "Starting",
    ShuttingDown = "Shutting Down",
    Error = "Error",
}

export enum ClientState {
    StandBy = "Stand-By",
    Ready = "Ready",
    Starting = "Starting",
    ShuttingDown = "Shutting Down",
    Error = "Error",
}

export enum ServerConnectionState {
    Accepted = "Accepted",
    Ready = "Ready",
    Closing = "Closing",
    Closed = "Closed",
    Error = "Error",
}

export type ServerConnection = {
    id: string
    state: ServerConnectionState
}
