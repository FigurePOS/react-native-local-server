import { Logger, LoggerVerbosity } from "../types"
import { tap } from "rxjs/operators"

export const log = <T = any>(logger: Logger | null, message: string) =>
    tap((value: T) => {
        if (logger?.verbosity !== LoggerVerbosity.JustError) {
            logger?.log(message, value)
        }
    })
