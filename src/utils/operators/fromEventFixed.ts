import { Observable, Subscriber } from "rxjs"

import { ErrorWithMetadata } from "../errors"

// We use this because rxjs fromEvent calls deprecated method on event emitter
export const fromEventFixed = <T>(eventEmitter: any, eventName: string): Observable<T> =>
    new Observable((subscriber: Subscriber<any>) => {
        if (eventEmitter.addListener != null) {
            const subscription = eventEmitter.addListener(eventName, (event: any) => {
                subscriber.next(event)
            })
            return () => subscription.remove()
        } else if (eventEmitter.addEventListener != null) {
            const subscription = eventEmitter.addEventListener(eventName, (event: any) => {
                subscriber.next(event)
            })
            return () => subscription.remove()
        } else {
            subscriber.complete()
            throw new ErrorWithMetadata("fromEventFixed - neither addListener not addEventListener are functions", {
                eventEmitter: eventEmitter,
                eventName: eventName,
            })
        }
    })
