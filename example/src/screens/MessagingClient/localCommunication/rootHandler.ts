import { MessageHandler } from "react-native-local-server"
import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"
import { switchMap } from "rxjs/operators"
import { SampleMessagingClientDependenciesType } from "./deps"
import { createActionMessagingClientDataReceived } from "../actions"
import { createMessageData } from "../../../common/components/messaging/functions"

export const rootHandler: MessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingClientDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                deps.dispatch(
                    createActionMessagingClientDataReceived(createMessageData("server", message.body.payload.text))
                )
            }
            return []
        })
    )
