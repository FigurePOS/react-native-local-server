import { Observable } from "rxjs"

import { marbles } from "../../../../utils/marbles"
import {
    MessagingServerStatusEventConnectionAccepted,
    MessagingServerStatusEventConnectionClosed,
    MessagingServerStatusEventConnectionReady,
    MessagingServerStatusEventReady,
    MessagingServerStatusEventStopped,
} from "../../../__fixtures__/serverStatusEvent"
import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../../types"
import { ofMessagingServerStatusEvent } from "../ofMessagingServerStatusEvent"

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
            const _out: Observable<MessagingServerStatusEvent> = m.hot("-a---------|", {
                a: MessagingServerStatusEventReady,
            })
            // @ts-expect-error - never x MessagingServerStatusEvent issue
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
            const _out: Observable<MessagingServerStatusEvent> = m.hot("---------a-|", {
                a: MessagingServerStatusEventStopped,
            })
            m.expect(__in.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.Stopped))).toBeObservable(
                // @ts-expect-error - never x MessagingServerStatusEvent issue
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
            const _out: Observable<MessagingServerStatusEvent> = m.hot("---a-------|", {
                a: MessagingServerStatusEventConnectionAccepted,
            })

            m.expect(
                __in.pipe(ofMessagingServerStatusEvent(MessagingServerStatusEventName.ConnectionAccepted)),
            ).toBeObservable(
                // @ts-expect-error - never x MessagingServerStatusEvent issue
                _out,
            )
        }),
    )
})
