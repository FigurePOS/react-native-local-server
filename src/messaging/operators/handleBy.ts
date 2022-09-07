import { Message, MessageHandler } from "../types"
import { Observable } from "rxjs"

export const handleBy =
    <In, Deps = any>(handler: MessageHandler<In, Deps>, deps: Deps) =>
    (source$: Observable<Message<In>>): Observable<boolean> =>
        source$.pipe((s$: Observable<Message<In>>): Observable<boolean> => {
            const out$ = handler(s$, deps)
            if (!out$) {
                throw new Error("Handlers should return Observable")
            }
            return out$
        })
