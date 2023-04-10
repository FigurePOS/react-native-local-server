/**
 * Object containing configuration of TCP server
 * @property port - port to listen on (if not specified, random port will be used)
 */
export type TCPServerConfiguration = {
    port?: number | null
    discovery?: {
        name: string
        group: string
    }
}
