export type MessageData = {
    from: "server" | "client" | "status"
    timestamp: string
    data: string
}
