export enum PhoneCallDirection {
    Inbound = "inbound",
    Outbound = "outbound",
}

export enum PhoneCallUpdate {
    Start = "start",
    End = "end",
}

export enum PhoneCallNumberException {
    Private = "Private",
    OutOfArea = "Out-of-Area",
}

export enum PhoneCallChecksum {
    Good = "good",
    Bad = "bad",
}

/**
 * @property number - phone number or one of the exception
 * @property name - identified name of the caller
 * @property line - line number of incoming call
 * @property date - date of the call (MM/DD)
 * @property time - time of the call (HH:MM [AP]M)
 * @property direction - indication if the call is inbound or outbound
 * @property update - information if the call started or ended
 * @property duration - duration of the call in seconds
 * @property checksum - information if the call has good checksum
 */
export type PhoneCall = {
    number?: string | PhoneCallNumberException
    name?: string

    line?: string
    date?: string
    time?: string
    direction?: PhoneCallDirection
    update?: PhoneCallUpdate
    duration?: number
    checksum?: PhoneCallChecksum
}
