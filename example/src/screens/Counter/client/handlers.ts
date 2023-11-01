import { MessageHandler } from "@figuredev/react-native-local-server"
import { CounterMessage, CounterMessageType } from "../common/messages"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { switchMap } from "rxjs/operators"
import { createActionCounterCountChanged } from "../data/actionts"
import { StateAction } from "../../../types"

export const counterChangedHandler: MessageHandler<
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
> = (message$) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountChanged) {
                return [createActionCounterCountChanged(message.body.payload.count)]
            }
            return []
        })
    )

export default [counterChangedHandler]
