import { Observable } from "rxjs"

import { MessagingServerStatusEvent, MessagingServerStatusEventName } from "../../"
import { marbles } from "../../../../utils/marbles"
import { fromMessagingServerStatusEvent } from "../fromMessagingServerStatusEvent"
import { waitForMessagingServerEvent } from "../waitForMessagingServerEvent"

jest.mock("../fromMessagingServerStatusEvent")

describe("waitForMessagingServerEvent", () => {
    it(
        "should wait for stopped event",
        marbles((m) => {
            const _in1 = m.hot("a|", { a: 1 })
            const ___m: Observable<MessagingServerStatusEvent> = m.cold("-a-b", {
                a: {
                    type: MessagingServerStatusEventName.Ready,
                    port: 12000,
                },
                b: {
                    type: MessagingServerStatusEventName.Stopped,
                    port: 12000,
                },
            })
            jest.mocked(fromMessagingServerStatusEvent).mockReturnValue(___m)
            const _out: Observable<never> = m.hot("---|")
            m.expect(
                _in1.pipe(waitForMessagingServerEvent("server-1", MessagingServerStatusEventName.Stopped)),
            ).toBeObservable(_out)
        }),
    )
})
