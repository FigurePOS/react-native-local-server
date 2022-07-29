import { marbles } from "rxjs-marbles"
import {
    DataObjectMessageAckFixture1,
    DataObjectMessageAckFixture2,
    DataObjectMessageFixture1,
    DataObjectMessageFixture2,
} from "../../__fixtures__/dataObject"
import { ofDataTypeMessage, ofDataTypeMessageAck } from "../ofDataType"
import { Observable } from "rxjs"
import { DataObject } from "../../types"

describe("ofDataTypeMessage", () => {
    it(
        "should filter messages",
        marbles((m) => {
            const __in: Observable<[DataObject, null]> = m.hot("-a-b-c-d-|", {
                a: [DataObjectMessageFixture1, null],
                b: [DataObjectMessageAckFixture1, null],
                c: [DataObjectMessageFixture2, null],
                d: [DataObjectMessageAckFixture2, null],
            })
            const _out: Observable<[DataObject, null]> = m.hot("-a---b---|", {
                a: [DataObjectMessageFixture1, null],
                b: [DataObjectMessageFixture2, null],
            })
            // @ts-ignore
            m.expect(__in.pipe(ofDataTypeMessage)).toBeObservable(_out)
        })
    )
})

describe("ofDataTypeMessageAck", () => {
    it(
        "should filter message ack",
        marbles((m) => {
            const __in: Observable<[DataObject, null]> = m.hot("-a-b-c-d-|", {
                a: [DataObjectMessageFixture1, null],
                b: [DataObjectMessageAckFixture1, null],
                c: [DataObjectMessageFixture2, null],
                d: [DataObjectMessageAckFixture2, null],
            })
            const _out: Observable<[DataObject, null]> = m.hot("---a---b-|", {
                a: [DataObjectMessageAckFixture1, null],
                b: [DataObjectMessageAckFixture2, null],
            })
            // @ts-ignore
            m.expect(__in.pipe(ofDataTypeMessageAck)).toBeObservable(_out)
        })
    )
})
