import { LoggerVerbosity, LoggerWrapper } from "../"

describe("LoggerWrapper", () => {
    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks()
    })

    it("should not log - lower verbosity", () => {
        const loggerWrapper = new LoggerWrapper()
        const logger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        }
        loggerWrapper.setLogger(logger, LoggerVerbosity.Low)
        const spy = jest.spyOn(logger, "log")

        loggerWrapper.log(LoggerVerbosity.Medium, "This is the message")

        return expect(spy).toHaveBeenCalledTimes(0)
    })

    it("should log", () => {
        const loggerWrapper = new LoggerWrapper()
        const logger = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        }
        loggerWrapper.setLogger(logger, LoggerVerbosity.Medium)
        const spy = jest.spyOn(logger, "log")

        loggerWrapper.log(LoggerVerbosity.Medium, "This is the message")

        return expect(spy).toHaveBeenCalledWith("This is the message", undefined)
    })
})
