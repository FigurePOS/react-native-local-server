import { composeTestPhoneCall, examplePhoneCall } from "../__fixtures__/phoneCall"
import { TestPackets } from "../__fixtures__/packetData"
import { composePacketDataFromPhoneCall, parsePhoneCallFromPacketData } from "../parser"
import { PhoneCallChecksum, PhoneCallDirection, PhoneCallNumberException, PhoneCallUpdate } from "../types"

describe("parsePhoneCallFromPacketData", () => {
    it("should not parse data when the format is invalid", () => {
        return expect(parsePhoneCallFromPacketData("random-string")).toEqual(null)
    })
    it("should parse example packet", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.example_)).toEqual(examplePhoneCall)
    })
    it("should parse packet without name", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.no__name)).toEqual(
            composeTestPhoneCall({
                name: undefined,
            }),
        )
    })
    it("should parse packet with private number", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.priv_num)).toEqual(
            composeTestPhoneCall({
                number: PhoneCallNumberException.Private,
                name: undefined,
            }),
        )
    })
    it("should parse packet with out of area number", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.out__num)).toEqual(
            composeTestPhoneCall({
                number: PhoneCallNumberException.OutOfArea,
                name: undefined,
            }),
        )
    })
    it("should parse outbound packet", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.outbound)).toEqual(
            composeTestPhoneCall({
                direction: PhoneCallDirection.Outbound,
            }),
        )
    })
    it("should parse end packet", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.end_call)).toEqual(
            composeTestPhoneCall({
                update: PhoneCallUpdate.End,
                duration: 257,
            }),
        )
    })
    it("should parse packet with bad checksum", () => {
        return expect(parsePhoneCallFromPacketData(TestPackets.bad_csum)).toEqual(
            composeTestPhoneCall({
                checksum: PhoneCallChecksum.Bad,
            }),
        )
    })
})

describe("composePacketDataFromPhoneCall", () => {
    it("should compose example packet", () => {
        return expect(composePacketDataFromPhoneCall(examplePhoneCall)).toEqual(TestPackets.example_)
    })

    it("should compose packet without name", () => {
        return expect(
            composePacketDataFromPhoneCall(
                composeTestPhoneCall({
                    name: undefined,
                }),
            ),
        ).toEqual(TestPackets.no__name)
    })

    it("should compose packet without number", () => {
        return expect(
            composePacketDataFromPhoneCall(
                composeTestPhoneCall({
                    name: undefined,
                    number: undefined,
                }),
            ),
        ).toEqual(TestPackets.priv_num)
    })

    it("should compose outbound packet", () => {
        return expect(
            composePacketDataFromPhoneCall(
                composeTestPhoneCall({
                    direction: PhoneCallDirection.Outbound,
                }),
            ),
        ).toEqual(TestPackets.outbound)
    })

    it("should compose end packet", () => {
        return expect(
            composePacketDataFromPhoneCall(
                composeTestPhoneCall({
                    update: PhoneCallUpdate.End,
                    duration: 257,
                }),
            ),
        ).toEqual(TestPackets.end_call)
    })

    it("should compose packet with bad check sum", () => {
        return expect(
            composePacketDataFromPhoneCall(
                composeTestPhoneCall({
                    checksum: PhoneCallChecksum.Bad,
                }),
            ),
        ).toEqual(TestPackets.bad_csum)
    })
})
