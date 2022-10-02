import { PhoneCall, PhoneCallChecksum, PhoneCallDirection } from "./types"

export const isPhoneCallInbound = (call: PhoneCall): boolean =>
    (call.direction ?? PhoneCallDirection.Inbound) === PhoneCallDirection.Inbound

export const hasPhoneCallGoodChecksum = (call: PhoneCall): boolean =>
    (call.checksum ?? PhoneCallChecksum.Good) === PhoneCallChecksum.Good
