import { marbles } from "../../../utils/marbles"
import {
    DataObjectMessageAckFixture1,
    DataObjectMessageAckFixture2,
    DataObjectMessageFixture1,
    DataObjectMessageFixture2,
} from "../../__fixtures__/dataObject"
import { ofDataTypeMessage, ofDataTypeMessageAck } from "../ofDataType"

describe("ofDataTypeMessage", () => {
    it(
        "should filter messages",
        marbles((m) => {
            const __in = m.hot("-a-b-c-d-|", {
                a: DataObjectMessageFixture1,
                b: DataObjectMessageAckFixture1,
                c: DataObjectMessageFixture2,
                d: DataObjectMessageAckFixture2,
            })
            const _out = m.hot("-a---b---|", {
                a: DataObjectMessageFixture1,
                b: DataObjectMessageFixture2,
            })
            m.expect(__in.pipe(ofDataTypeMessage)).toBeObservable(_out)
        }),
    )
})

describe("ofDataTypeMessageAck", () => {
    it(
        "should filter message ack",
        marbles((m) => {
            const __in = m.hot("-a-b-c-d-|", {
                a: DataObjectMessageFixture1,
                b: DataObjectMessageAckFixture1,
                c: DataObjectMessageFixture2,
                d: DataObjectMessageAckFixture2,
            })
            const _out = m.hot("---a---b-|", {
                a: DataObjectMessageAckFixture1,
                b: DataObjectMessageAckFixture2,
            })
            m.expect(__in.pipe(ofDataTypeMessageAck)).toBeObservable(_out)
        }),
    )
})
