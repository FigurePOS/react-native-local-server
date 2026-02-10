import { tap } from "rxjs/operators"

import { LoggerWrapper } from "../logger"
import { LoggerVerbosity } from "../logger/types"

export const log = <T = unknown>(verbosity: LoggerVerbosity, logger: LoggerWrapper, message: string) =>
    tap((value: T) => {
        logger.log(verbosity, message, value)
    })
