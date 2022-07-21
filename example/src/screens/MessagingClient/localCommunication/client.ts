import { MessagingClient } from "react-native-local-server"
import { LocalCommunicationMessage } from "./messages"
import { SampleMessagingClientDependenciesType } from "./deps"

export const SampleMessagingClient = new MessagingClient<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingClientDependenciesType
>("sample-messaging-client")
