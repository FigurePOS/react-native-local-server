/**
 * Object containing configuration of TCP server
 * @property port - port to listen on
 */
export type TCPServerConfiguration = {
    port: number
    discovery?: {
        name: string
        group: string
    }
}
