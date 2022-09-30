import { PhoneCall, PhoneCallChecksum, PhoneCallDirection, PhoneCallUpdate } from "../types"

export const examplePhoneCall: PhoneCall = {
    number: "770-263-7111",
    name: "CALLERID.COM",

    line: "01",
    date: "12/17",
    time: "04:54 PM",
    direction: PhoneCallDirection.Inbound,
    update: PhoneCallUpdate.Start,
    duration: 0,
    checksum: PhoneCallChecksum.Good,
}

export const composeTestPhoneCall = (overrides: Partial<PhoneCall>): PhoneCall => {
    return {
        ...examplePhoneCall,
        ...overrides,
    }
}
