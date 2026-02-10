import { Observable } from "rxjs"

import { Message, MessageHandler } from "../types"

export const handleBy =
    <In, Deps = unknown, Result = unknown>(handler: MessageHandler<In, Deps, Result>, deps: Deps) =>
    (source$: Observable<Message<In>>): Observable<Result> =>
        source$.pipe((s$: Observable<Message<In>>): Observable<Result> => {
            const out$ = handler(s$, deps)
            if (!out$) {
                throw new Error("Handlers should return Observable")
            }
            return out$
        })
