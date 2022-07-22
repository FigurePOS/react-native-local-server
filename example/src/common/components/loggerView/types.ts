export type LoggerMessage = {
    type: "info" | "warn" | "error"
    message: string
    data: any
}
