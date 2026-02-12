import { MessagingServer } from "@figuredev/react-native-local-server"

import { ConsoleLogger } from "../../../common/ConsoleLogger"
import { StateAction } from "../../../types"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { CounterMessage } from "../common/messages"

export const CounterServer = new MessagingServer<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
>("counter-server")
CounterServer.setLogger(ConsoleLogger)
