export enum LoggerVerbosity {
    JustError = "just-error",
    Messaging = "messaging",
    TCP = "tcp",
}

export type Logger = {
    readonly verbosity: LoggerVerbosity
    log: (message: string, data?: any) => void
    warn: (message: string, data: any) => void
    error: (message: string, data?: any) => void
}

export enum StopReasonEnum {
    Manual = "manual",
    ClosedByPeer = "closed-by-peer",
    Invalidation = "invalidation",
}

export type StopReason = StopReasonEnum | string
