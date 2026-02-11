export enum LoggerVerbosity {
    Low,
    Medium,
    High,
}

export type Logger = {
    log: (message: string, data?: unknown) => void
    warn: (message: string, data: unknown) => void
    error: (message: string, data?: unknown) => void
}
