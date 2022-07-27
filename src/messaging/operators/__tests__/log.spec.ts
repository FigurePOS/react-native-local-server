import { marbles } from "rxjs-marbles"
import { log } from "../log"
import spyOn = jest.spyOn

describe("log", () => {
    it(
        "should do nothing with null logger",
        marbles((m) => {
            const __in = m.hot("-a-|", {
                a: 1,
            })
            const _out = m.hot("-a-|", {
                a: 1,
            })
            m.expect(__in.pipe(log(null, "This is the message"))).toBeObservable(_out)
        })
    )
    it(
        "should log the data with the message",
        marbles((m) => {
            const logger = {
                log: jest.fn(),
            }
            const spy = spyOn(logger, "log")
            const __in = m.hot("-a-b-|", {
                a: "data 1",
                b: "data 2",
            })
            const _out = m.hot("-a-b-|", {
                a: "data 1",
                b: "data 2",
            })
            // @ts-ignore
            m.expect(__in.pipe(log(logger, "This is the message"))).toBeObservable(_out)
            m.flush()
            expect(spy).toBeCalledWith("This is the message", "data 1")
            expect(spy).toBeCalledWith("This is the message", "data 2")
        })
    )
})
