import { marbles } from "../../../../utils/marbles"
import { Observable } from "rxjs"
import { ofMessagingServerStatusEvent } from "../ofMessagingServerStatusEvent"
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
            m.expect(__in.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.Ready))).toBeObservable(_out)
        }),
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
            m.expect(__in.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.Stopped))).toBeObservable(
                // @ts-ignore
                _out,
            )
        }),
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

            m.expect(
                __in.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionAccepted)),
            ).toBeObservable(
                // @ts-ignore
                _out,
            )
        }),
    )
})
