import { PhoneCall, PhoneCallChecksum, PhoneCallDirection, PhoneCallUpdate } from "./types"

export const composePacketDataFromPhoneCall = (call: PhoneCall): string => {
    const prefix = "^^<U>nnnnnn<S>nnnnnn$"
    const line = `${call.line ?? 1}`.padStart(2, "0")
    const dir = (call.direction ?? PhoneCallDirection.Inbound) === PhoneCallDirection.Outbound ? "O" : "I"
    const update = (call.update ?? PhoneCallUpdate.Start) === PhoneCallUpdate.End ? "E" : "S"
    const dur = `${call.duration ?? 0}`.padStart(4, "0")
    const check = (call.checksum ?? PhoneCallChecksum.Good) === PhoneCallChecksum.Good ? "G" : "B"
    const date = call.date ?? "01/01"
    const time = call.time ?? "00:00 AM"
    const phone = (call.number ?? "Private").padEnd(14, " ")
    const name = (call.name ?? "").padEnd(15, " ")
    return `${prefix}${line} ${dir} ${update} ${dur} ${check} A0 ${date} ${time} ${phone} ${name}`
}

export const parsePhoneCallFromPacketData = (data: string): PhoneCall | null => {
    const pattern = /.*(\d\d) ([IO]) ([ESB]) (\d{4}) ([GB]) (.\d) (\d\d\/\d\d) (\d\d:\d\d [AP]M) (.{8,15})(.*)/
    const matches = pattern.exec(data)
    if (matches == null) {
        return null
    }
    const parsedDuration = Number.parseInt(matches[4] ?? "0", 10)
    const parsedName = matches[10]?.trim() ?? ""
    return {
        line: matches[1],
        direction: matches[2] === "O" ? PhoneCallDirection.Outbound : PhoneCallDirection.Inbound,
        update: matches[3] === "E" ? PhoneCallUpdate.End : PhoneCallUpdate.Start,
        duration: Number.isNaN(parsedDuration) ? 0 : parsedDuration,
        checksum: matches[5] === "G" ? PhoneCallChecksum.Good : PhoneCallChecksum.Bad,
        date: matches[7],
        time: matches[8],
        number: matches[9]?.trim() ?? undefined,
        name: parsedName.length === 0 ? undefined : parsedName,
    }
}
