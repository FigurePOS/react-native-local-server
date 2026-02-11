import { Observable, Subscriber } from "rxjs"

// We use this because rxjs fromEvent calls deprecated method on event emitter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromEventFixed = (eventEmitter: any, eventName: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Observable((subscriber: Subscriber<any>) => {
        if (eventEmitter.addListener != null) {
            const subscription = eventEmitter.addListener(eventName, (event: unknown) => {
                subscriber.next(event)
            })
            return () => subscription.remove()
        } else if (eventEmitter.addEventListener != null) {
            const subscription = eventEmitter.addEventListener(eventName, (event: unknown) => {
                subscriber.next(event)
            })
            return () => subscription.remove()
        } else {
            return () => subscriber.complete()
        }
    })
