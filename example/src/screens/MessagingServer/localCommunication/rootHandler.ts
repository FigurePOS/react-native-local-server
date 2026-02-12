import { switchMap } from "rxjs/operators"

import { MessageHandler } from "@figuredev/react-native-local-server"

import { createMessageData } from "../../../common/components/messaging/functions"
import { createActionMessagingServerDataReceived } from "../actions"

import { SampleMessagingServerDependenciesType } from "./deps"
import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"

export const rootHandler: MessageHandler<LocalCommunicationMessage, SampleMessagingServerDependenciesType> = (
    message$,
    deps,
) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                deps.dispatch(
                    createActionMessagingServerDataReceived(
                        message.source.connectionId,
                        createMessageData("client", message.body.payload.text),
                    ),
                )
            }
            return []
        }),
    )
