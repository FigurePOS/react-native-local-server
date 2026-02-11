import { MessagingServer } from "@figuredev/react-native-local-server"

import { SampleMessagingServerDependenciesType } from "./deps"
import { LocalCommunicationMessage } from "./messages"

export const SampleMessagingServer = new MessagingServer<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
>("sample-messaging-server")
