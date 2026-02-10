import { MessagingClient } from "@figuredev/react-native-local-server"

import { SampleMessagingClientDependenciesType } from "./deps"
import { LocalCommunicationMessage } from "./messages"

export const SampleMessagingClient = new MessagingClient<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingClientDependenciesType
>("sample-messaging-client")
