import { MessagingServer } from "react-native-local-server"
import { LocalCommunicationMessage } from "./messages"
import { SampleMessagingServerDependenciesType } from "./deps"

export const SampleMessagingServer = new MessagingServer<
    LocalCommunicationMessage,
    LocalCommunicationMessage,
    SampleMessagingServerDependenciesType
>("sample-messaging-server")
