import { MessagingClient } from "@figuredev/react-native-local-server"

import { ConsoleLogger } from "../../../common/ConsoleLogger"
import { StateAction } from "../../../types"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { CounterMessage } from "../common/messages"

export const CounterClient = new MessagingClient<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
>("counter-client", "fgr-counter")
CounterClient.setLogger(ConsoleLogger)
