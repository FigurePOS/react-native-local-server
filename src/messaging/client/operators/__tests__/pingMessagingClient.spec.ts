import { Observable, Subject } from "rxjs"
import * as uuid from "uuid"

import { pingMessagingClient } from "../"
import { marbles } from "../../../../utils/marbles"
import { MessagingClientStatusEventStopped } from "../../../__fixtures__/clientStatusEvent"
import { DataObjectMessageFixture1 } from "../../../__fixtures__/dataObject"
import { composeDataObjectPing, DataObject } from "../../../types"
import { MessagingClientStatusEvent } from "../../types"

jest.mock("uuid", () => ({
    v4: jest.fn(),
}))

const mockIds = (values: string[]) => {
    values.forEach((v) => {
        // @ts-ignore
        uuid.v4.mockReturnValueOnce(v)
    })
}

describe("pingClient", () => {
    it(
        "should fail when it doesn't get the first ping till timeout",
        marbles((m) => {
            const _dataIn = "-----"
            const dataOut = "-----"
            const _status = "-----"
            const ____out = "----#"
            const status$: Observable<MessagingClientStatusEvent> = m.hot(_status, {})
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {})
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {})
            const _out: Observable<boolean> = m.hot(____out, {}, new Error("Server ping timed out"))
            const pingTimeout = m.time("----|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingClient(status$, dataIn$, dataOut$, pingTimeout, m.scheduler)
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )

    it(
        "should fail when it doesn't get the second ping till timeout",
        marbles((m) => {
            const ids = ["ping-1"]
            mockIds(ids)
            const _dataIn = "--a----"
            const dataOut = "--a----"
            const _status = "-------"
            const ____out = "--a---#"
            const status$: Observable<MessagingClientStatusEvent> = m.hot(_status, {})
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0]),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                },
                new Error("Server ping timed out"),
            )
            const pingTimeout = m.time("----|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingClient(status$, dataIn$, dataOut$, pingTimeout, m.scheduler)
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should timeout based on last ping",
        marbles((m) => {
            const ids = ["ping-1", "ping-2"]
            mockIds(ids)
            const _dataIn = "--a--b----"
            const dataOut = "--a--b----"
            const _status = "----------"
            const ____out = "--a--b---#"
            const status$: Observable<MessagingClientStatusEvent> = m.hot(_status, {})
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                    b: true,
                },
                new Error("Server ping timed out"),
            )
            const pingTimeout = m.time("----|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingClient(status$, dataIn$, dataOut$, pingTimeout, m.scheduler)
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should not timeout when receiving data instead of ping",
        marbles((m) => {
            const ids = ["ping-1", "ping-2"]
            mockIds(ids)
            const _dataIn = "--a--b--c----"
            const dataOut = "--a-----b----"
            const _status = "-------------"
            const ____out = "--a--b--c---#"
            const status$: Observable<MessagingClientStatusEvent> = m.hot(_status, {})
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: DataObjectMessageFixture1,
                c: composeDataObjectPing(ids[1]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                    b: true,
                    c: true,
                },
                new Error("Server ping timed out"),
            )
            const pingTimeout = m.time("----|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingClient(status$, dataIn$, dataOut$, pingTimeout, m.scheduler)
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should stop on connection stopped",
        marbles((m) => {
            const ids = ["ping-1"]
            mockIds(ids)
            const _dataIn = "--a---"
            const dataOut = "--a---"
            const _status = "-----a"
            const ____out = "--a--|"
            const status$: Observable<MessagingClientStatusEvent> = m.hot(_status, {
                a: MessagingClientStatusEventStopped,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0]),
            })
            const _out: Observable<boolean> = m.hot(____out, {
                a: true,
            })
            const pingTimeout = m.time("----|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingClient(status$, dataIn$, dataOut$, pingTimeout, m.scheduler)
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
})
