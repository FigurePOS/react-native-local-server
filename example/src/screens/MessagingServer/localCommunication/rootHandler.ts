import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"
import { switchMap } from "rxjs/operators"
import { SampleMessagingServerDependenciesType } from "./deps"
import { createActionMessagingServerDataReceived } from "../actions"
import { createMessageData } from "../../../common/components/messaging/functions"
import { MessageHandler } from "@figuredev/react-native-local-server"

export const rootHandler: MessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                deps.dispatch(
                    createActionMessagingServerDataReceived(
                        message.source.connectionId,
                        createMessageData("client", message.body.payload.text)
                    )
                )
            }
            return []
        })
    )
