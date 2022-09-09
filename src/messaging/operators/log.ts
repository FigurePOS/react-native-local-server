import { Logger } from "../../utils/types"
import { tap } from "rxjs/operators"
import { LoggerVerbosity } from "../types"

export const log = <T = any>(
    logger: Logger | null,
    message: string,
    verbosity: LoggerVerbosity = LoggerVerbosity.JustError
) =>
    tap((value: T) => {
        if (verbosity !== LoggerVerbosity.JustError) {
            logger?.log(message, value)
        }
    })
