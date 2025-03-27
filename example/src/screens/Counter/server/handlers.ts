import { MessageHandler } from "@figuredev/react-native-local-server"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { switchMap } from "rxjs/operators"
import { CounterMessage, CounterMessageType, createCounterMessageCountChanged } from "../common/messages"
import { createActionCounterCountReset } from "../data/actionts"
import { getCounterCount } from "../data/selectors"
import { CounterServer } from "./server"
import { StateAction } from "../../../types"

export const counterResetRequestedHandler: MessageHandler<
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
> = (message$) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountResetRequested) {
                return [createActionCounterCountReset()]
            }
            return []
        }),
    )

export const counterRequestedHandler: MessageHandler<
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === CounterMessageType.CountRequested) {
                const count = getCounterCount(deps.getState())
                CounterServer.send(createCounterMessageCountChanged(count), message.source.connectionId)
            }
            return []
        }),
    )

export default [counterResetRequestedHandler, counterRequestedHandler]
