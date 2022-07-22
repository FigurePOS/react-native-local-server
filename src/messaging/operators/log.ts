import { Logger } from "../../utils/types"
import { tap } from "rxjs/operators"

export const log = <T = any>(logger: Logger | null, message: string) =>
    tap((value: T) => {
        logger?.log(message, value)
    })
