import { MessageHandler } from "react-native-local-server"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { switchMap } from "rxjs/operators"
import { CounterMessage, CounterMessageType, createCounterMessageCountChanged } from "../common/messages"
import { createActionCounterCountReset } from "../data/actionts"
import { getCounterCount } from "../data/selectors"

export const counterResetRequestedHandler: MessageHandler<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountResetRequested) {
                deps.dispatch(createActionCounterCountReset())
            }
            return []
        })
    )

export const counterRequestedHandler: MessageHandler<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountRequested) {
                const count = getCounterCount(deps.getState())
                return [createCounterMessageCountChanged(count)]
            }
            return []
        })
    )

export default [counterResetRequestedHandler, counterRequestedHandler]
