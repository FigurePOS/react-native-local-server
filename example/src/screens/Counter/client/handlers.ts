import { MessageHandler } from "react-native-local-server"
import { CounterMessage, CounterMessageType } from "../common/messages"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { switchMap } from "rxjs/operators"
import { createActionCounterCountChanged } from "../data/actionts"

export const counterChangedHandler: MessageHandler<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountChanged) {
                deps.dispatch(createActionCounterCountChanged(message.body.payload.count))
            }
            return []
        })
    )

export default [counterChangedHandler]
