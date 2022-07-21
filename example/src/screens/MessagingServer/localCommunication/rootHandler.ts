import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"
import { switchMap } from "rxjs/operators"
import { SampleMessagingServerDependenciesType } from "./deps"
import { createActionMessagingServerDataReceived } from "../actions"
import { createMessageData } from "../../../common/components/messaging/functions"
import { ServerMessageHandler } from "../../../../../src/messaging/types"

export const rootHandler: ServerMessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            console.log("SERVER - handler ", message)
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                deps.dispatch(
                    // TODO connectionId
                    createActionMessagingServerDataReceived(
                        message.connectionId,
                        createMessageData("client", message.body.payload.text)
                    )
                )
            }
            return []
        })
    )
