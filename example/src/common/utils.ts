import { Observable, Subscriber } from "rxjs"

// We use this because rxjs fromEvent calls deprecated method on event emitter
export const fromEventFixed = (eventEmitter: any, eventName: string) =>
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
            return () => subscriber.complete()
        }
    })
