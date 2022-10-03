import { tap } from "rxjs/operators"
import { LoggerVerbosity } from "../logger/types"
import { LoggerWrapper } from "../logger/loggerWrapper"

export const log = <T = any>(verbosity: LoggerVerbosity, logger: LoggerWrapper, message: string) =>
    tap((value: T) => {
        logger.log(verbosity, message, value)
    })
