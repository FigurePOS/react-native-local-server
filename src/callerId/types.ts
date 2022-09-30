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
