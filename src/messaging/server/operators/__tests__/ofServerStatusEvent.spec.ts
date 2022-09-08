import { marbles } from "rxjs-marbles"
import { Observable } from "rxjs"
import { ofServerStatusEvent } from "../ofServerStatusEvent"
import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../../types"
import {
    MessagingServerStatusEventConnectionAccepted,
    MessagingServerStatusEventConnectionClosed,
    MessagingServerStatusEventConnectionReady,
    MessagingServerStatusEventReady,
    MessagingServerStatusEventStopped,
} from "../../../__fixtures__/serverStatusEvent"

describe("ofServerStatusEvent", () => {
    it(
        "should filter messages - server ready",
        marbles((m) => {
            const __in: Observable<MessagingServerStatusEvent> = m.hot("-a-b-c-d-e-|", {
                a: MessagingServerStatusEventReady,
                b: MessagingServerStatusEventConnectionAccepted,
                c: MessagingServerStatusEventConnectionReady,
                d: MessagingServerStatusEventConnectionClosed,
                e: MessagingServerStatusEventStopped,
            })
            const _out: Observable<any> = m.hot("-a---------|", {
                a: MessagingServerStatusEventReady,
            })
            // @ts-ignore
            m.expect(__in.pipe(ofServerStatusEvent(MessagingServerStatusEventName.Ready))).toBeObservable(_out)
        })
    )
    it(
        "should filter messages - server stopped",
        marbles((m) => {
            const __in: Observable<MessagingServerStatusEvent> = m.hot("-a-b-c-d-e-|", {
                a: MessagingServerStatusEventReady,
                b: MessagingServerStatusEventConnectionAccepted,
                c: MessagingServerStatusEventConnectionReady,
                d: MessagingServerStatusEventConnectionClosed,
                e: MessagingServerStatusEventStopped,
            })
            const _out: Observable<any> = m.hot("---------a-|", {
                a: MessagingServerStatusEventStopped,
            })
            // @ts-ignore

            m.expect(__in.pipe(ofServerStatusEvent(MessagingServerStatusEventName.Stopped))).toBeObservable(_out)
        })
    )
    it(
        "should filter messages - connection accepted",
        marbles((m) => {
            const __in: Observable<MessagingServerStatusEvent> = m.hot("-a-b-c-d-e-|", {
                a: MessagingServerStatusEventReady,
                b: MessagingServerStatusEventConnectionAccepted,
                c: MessagingServerStatusEventConnectionReady,
                d: MessagingServerStatusEventConnectionClosed,
                e: MessagingServerStatusEventStopped,
            })
            const _out: Observable<any> = m.hot("---a-------|", {
                a: MessagingServerStatusEventConnectionAccepted,
            })

            m.expect(__in.pipe(ofServerStatusEvent(MessagingServerStatusEventName.ConnectionAccepted))).toBeObservable(
                // @ts-ignore
                _out
            )
        })
    )
})
