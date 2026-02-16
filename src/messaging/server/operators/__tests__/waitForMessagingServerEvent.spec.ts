import { MessagingServerStatusEventName } from "../../"
import { marbles } from "../../../../utils/marbles"
import { fromMessagingServerStatusEvent } from "../fromMessagingServerStatusEvent"
import { waitForMessagingServerEvent } from "../waitForMessagingServerEvent"

jest.mock("../fromMessagingServerStatusEvent")

describe("waitForMessagingServerEvent", () => {
    it(
        "should wait for stopped event",
        marbles((m) => {
            const _in1 = m.hot("a|", { a: 1 })
            const ___m = m.cold("-a-b", {
                a: {
                    type: MessagingServerStatusEventName.Ready,
                },
                b: {
                    type: MessagingServerStatusEventName.Stopped,
                },
            })
            // @ts-ignore
            fromMessagingServerStatusEvent.mockReturnValue(___m)
            const _out = m.hot("---|")
            m.expect(
                _in1.pipe(waitForMessagingServerEvent("server-1", MessagingServerStatusEventName.Stopped)),
                // @ts-ignore
            ).toBeObservable(_out)
        }),
    )
})
