import { LoggerVerbosity, LoggerWrapper } from "../../logger"
import { marbles } from "../../marbles"
import { log } from "../log"

import spyOn = jest.spyOn

describe("log", () => {
    it(
        "should log the data with the message",
        marbles((m) => {
            // @ts-expect-error - partial implementation for testing
            const logger: LoggerWrapper = {
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
            m.expect(__in.pipe(log(LoggerVerbosity.Low, logger, "This is the message"))).toBeObservable(_out)
            m.flush()
            expect(spy).toHaveBeenCalledWith(LoggerVerbosity.Low, "This is the message", "data 1")
            expect(spy).toHaveBeenCalledWith(LoggerVerbosity.Low, "This is the message", "data 2")
        }),
    )
})
