import { Message, MessageHandler, ServerMessageHandler } from "../types"
import { Observable, of } from "rxjs"
import { mergeMap, withLatestFrom } from "rxjs/operators"

// TODO
export const handleBy =
    <In, Out = In, Deps = any, A = null>(
        handler: MessageHandler<In, Out> | ServerMessageHandler<In, Out>,
        deps: Deps
    ) =>
    (source$: Observable<[Message<In>, A]>): Observable<[Message<Out>, A]> =>
        source$.pipe(
            // (s$: Observable<[Message<In>, A]>): Observable<[Message<Out>, A]> => {
            //     const out$ = handler(s$.pipe(map(([message, _]) => message)), deps)
            //     if (!out$) {
            //         throw new Error("KOKOT")
            //     }
            //     return out$
            // }
            mergeMap(([message, info]: [Message<In>, A]): Observable<[Message<Out>, A]> => {
                // @ts-ignore
                return handler(of(message), deps).pipe(withLatestFrom(of(info)))
            })
        )
