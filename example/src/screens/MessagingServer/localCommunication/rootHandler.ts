import { LocalCommunicationMessage, LocalCommunicationMessageType } from "./messages"
import { switchMap } from "rxjs/operators"
import { SampleMessagingServerDependenciesType } from "./deps"
import { createActionMessagingServerDataReceived } from "../actions"
import { createMessageData } from "../../../common/components/messaging/functions"
import { timer } from "rxjs"
import { combineServerHandlers, ServerMessageHandler } from "react-native-local-server"

export const handler1: ServerMessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
> = (message$) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                console.log("handler 1 " + new Date().toISOString())
            }
            return timer(500).pipe(
                switchMap(() => {
                    console.log("handler 1 after 500ms " + new Date().toISOString())
                    return []
                })
            )
        })
    )

export const handler2: ServerMessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
> = (message$, deps) =>
    message$.pipe(
        switchMap((message) => {
            if (message.body.type === LocalCommunicationMessageType.TextMessageSent) {
                console.log("handler 2 " + new Date().toISOString())
                deps.dispatch(
                    createActionMessagingServerDataReceived(
                        message.connectionId,
                        createMessageData("client", message.body.payload.text)
                    )
                )
            }
            return timer(500).pipe(
                switchMap(() => {
                    console.log("handler 2 after 500ms " + new Date().toISOString())
                    return []
                })
            )
        })
    )

export const rootHandler: ServerMessageHandler<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
> = combineServerHandlers(handler1, handler2)
