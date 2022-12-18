/**
 * Object containing configuration of TCP client
 * @property connection - connection configuration
 */
export type TCPClientConfiguration = {
    connection: TCPClientConnectionConfiguration
}

export enum TCPClientConnectionMethod {
    Raw = "raw",
    Discovery = "discovery",
}

/**
 * Object containing connection configuration of TCP client
 * @property host - target host address
 * @property port - target port
 */
export type TCPClientConnectionMethodRaw = {
    method: TCPClientConnectionMethod.Raw
    host: string
    port: number
}

/**
 * Object containing connection configuration of TCP client
 * @property group - target group name (for "_fgr-counter._tcp" use "fgr-counter")
 * @property name - target name
 */
export type TCPClientConnectionMethodDiscovery = {
    method: TCPClientConnectionMethod.Discovery
    group: string
    name: string
}

export type TCPClientConnectionConfiguration = TCPClientConnectionMethodRaw | TCPClientConnectionMethodDiscovery
