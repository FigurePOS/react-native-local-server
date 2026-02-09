import { switchMap } from "rxjs/operators"

import { MessageHandler } from "@figuredev/react-native-local-server"

import { createMessageData } from "../../../common/components/messaging/functions"
import { createActionMessagingClientDataReceived } from "../actions"

import { SampleMessagingClientDependenciesType } from "./deps"
import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"


export const rootHandler: MessageHandler<LocalCommunicationMessage, SampleMessagingClientDependenciesType> = (
    message$,
    deps,
) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                deps.dispatch(
                    createActionMessagingClientDataReceived(createMessageData("server", message.body.payload.text)),
                )
            }
            return []
        }),
    )
