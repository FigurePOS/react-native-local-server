import { switchMap } from "rxjs/operators"

import { MessageHandler } from "@figuredev/react-native-local-server"

import { StateAction } from "../../../types"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { CounterMessage, CounterMessageType } from "../common/messages"
import { createActionCounterCountChanged } from "../data/actionts"

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
        }),
    )

export default [counterChangedHandler]
