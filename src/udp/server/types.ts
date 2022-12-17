/**
 * Object containing configuration of UDP server
 * @property port - port to listen on
 * @property numberOfDroppedBytesFromMsgStart - number of bytes that will be dropped from the beginning of the msg.
 *  This is required for callerId in iOS release configuration.
 */
export type UDPServerConfiguration = {
    port: number
    numberOfDroppedBytesFromMsgStart?: number
}
