export enum LoggerVerbosity {
    Low,
    Medium,
    High,
}

export type Logger = {
    log: (message: string, data?: any) => void
    warn: (message: string, data: any) => void
    error: (message: string, data?: any) => void
}
