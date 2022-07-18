import { MessageHandler, Message } from "../types"
import { Observable } from "rxjs"

export const handleBy =
    <In, Out = In, Deps = any>(handler: MessageHandler<In, Out>, deps: Deps) =>
    (source$: Observable<Message<In>>): Observable<Message<Out>> =>
        source$.pipe((s$: Observable<Message<In>>) => {
            const out$ = handler(s$, deps)
            if (!out$) {
                throw new Error("KOKOT")
            }
            return out$
        })
