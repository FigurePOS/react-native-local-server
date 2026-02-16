import { Observable, Subject } from "rxjs"
import * as uuid from "uuid"

import { marbles } from "../../../../utils/marbles"
import { DataObjectMessageFixture1 } from "../../../__fixtures__/dataObject"
import {
    MessagingServerStatusEventConnectionClosed,
    MessagingServerStatusEventStopped,
} from "../../../__fixtures__/serverStatusEvent"
import { composeDataObjectPing, DataObject } from "../../../types"
import { MessagingServerStatusEvent } from "../../types"
import { pingMessagingServerConnection } from "../pingMessagingServerConnection"

jest.mock("uuid", () => ({
    v4: jest.fn(),
}))

const mockIds = (values: string[]) => {
    // @ts-expect-error - string x Uint8Array<ArrayBufferLike> issue
    values.forEach((v) => jest.mocked(uuid.v4).mockReturnValueOnce(v))
}

describe("pingServerConnection", () => {
    afterEach(() => {
        jest.resetAllMocks()
    })
    const connectionId: string = "connection-1"
    it(
        "should ping once and stop on connection closed",
        marbles((m) => {
            const ids = ["ping-1"]
            mockIds(ids)
            const dataOut = "---a---"
            const _dataIn = "----a--"
            const _status = "------a"
            const ____out = "----a-|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
            })
            const _out: Observable<boolean> = m.hot(____out, {
                a: true,
            })
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                3,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should not stop after one unsuccessful ping",
        marbles((m) => {
            const ids = ["ping-1", "ping-2", "ping-3", "ping-4"]
            mockIds(ids)
            const dataOut = "---a--b--c--d--"
            const _dataIn = "----a-----b--c-"
            const _status = "--------------a"
            const ____out = "----a---b-c--d|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                // there is missing ping response
                b: composeDataObjectPing(ids[2]),
                c: composeDataObjectPing(ids[3]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
                c: composeDataObjectPing(ids[2], connectionId),
                d: composeDataObjectPing(ids[3], connectionId),
            })
            const _out: Observable<boolean> = m.hot(____out, {
                a: true,
                b: false,
                c: true,
                d: true,
            })
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                3,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should not stop on other connection closed",
        marbles((m) => {
            const ids = ["ping-1", "ping-2", "ping-3", "ping-4"]
            mockIds(ids)
            const dataOut = "---a--b--c--d--"
            const _dataIn = "----a--b--c--d-"
            const _status = "------a-------b"
            const ____out = "----a--b--c--d|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: { ...MessagingServerStatusEventConnectionClosed, connectionId: "connection-2" },
                b: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
                c: composeDataObjectPing(ids[2]),
                d: composeDataObjectPing(ids[3]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
                c: composeDataObjectPing(ids[2], connectionId),
                d: composeDataObjectPing(ids[3], connectionId),
            })
            const _out: Observable<boolean> = m.hot(____out, {
                a: true,
                b: true,
                c: true,
                d: true,
            })
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                3,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should stop on server stopped",
        marbles((m) => {
            const ids = ["ping-1", "ping-2"]
            mockIds(ids)
            const dataOut = "---a--b---"
            const _dataIn = "----a--b--"
            const _status = "---------a"
            const ____out = "----a--b-|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventStopped,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
            })
            const _out: Observable<boolean> = m.hot(____out, {
                a: true,
                b: true,
            })
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                3,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should throw an error after 2 unsuccessful pings",
        marbles((m) => {
            const ids = ["ping-1", "ping-2", "ping-3", "ping-4"]
            mockIds(ids)
            const dataOut = "---a--b--c--"
            const _dataIn = "----a-------"
            const _status = "------------"
            const ____out = "----a---b--#"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                // there are missing ping responses
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
                c: composeDataObjectPing(ids[2], connectionId),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                    b: false,
                },
                new Error("Ping failed 2 times"),
            )
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                2,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should not throw an error after 1 ping being delayed",
        marbles((m) => {
            const ids = ["ping-1", "ping-2", "ping-3", "ping-4"]
            mockIds(ids)
            const dataOut = "---a--b--c---"
            const _dataIn = "----a-----b--"
            const _status = "------------a"
            const ____out = "----a---b-c-|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: composeDataObjectPing(ids[1]),
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
                c: composeDataObjectPing(ids[2], connectionId),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                    b: false,
                    c: true,
                },
                "Ping failed 2 times",
            )
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                2,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
    it(
        "should not throw an error if some data arrived instead of ping",
        marbles((m) => {
            const ids = ["ping-1", "ping-2", "ping-3", "ping-4"]
            mockIds(ids)
            const dataOut = "---a--b--c---"
            const _dataIn = "----a-----b--"
            const _status = "------------a"
            const ____out = "----a---b-c-|"
            const status$: Observable<MessagingServerStatusEvent> = m.hot(_status, {
                a: MessagingServerStatusEventConnectionClosed,
            })
            const dataIn$: Observable<DataObject> = m.hot(_dataIn, {
                a: composeDataObjectPing(ids[0]),
                b: DataObjectMessageFixture1,
            })
            const expectedDataOut$: Observable<DataObject> = m.hot(dataOut, {
                a: composeDataObjectPing(ids[0], connectionId),
                b: composeDataObjectPing(ids[1], connectionId),
                c: composeDataObjectPing(ids[2], connectionId),
            })
            const _out: Observable<boolean> = m.hot(
                ____out,
                {
                    a: true,
                    b: false,
                    c: true,
                },
                "Ping failed 2 times",
            )
            const pingInterval = m.time("---|")
            const pingTimeout = m.time("--|")
            const dataOut$: Subject<DataObject> = new Subject<DataObject>()
            const result = pingMessagingServerConnection(
                connectionId,
                status$,
                dataIn$,
                dataOut$,
                pingInterval,
                pingTimeout,
                2,
                m.scheduler,
            )
            m.expect(result).toBeObservable(_out)
            m.expect(dataOut$).toBeObservable(expectedDataOut$)
        }),
    )
})
