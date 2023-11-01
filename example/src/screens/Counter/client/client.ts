import { MessagingClient } from "@figuredev/react-native-local-server"
import { ConsoleLogger } from "../../../common/ConsoleLogger"
import { CounterMessage } from "../common/messages"
import { SampleMessagingClientDependenciesType } from "../../MessagingClient/localCommunication/deps"
import { StateAction } from "../../../types"

export const CounterClient = new MessagingClient<
    CounterMessage,
    CounterMessage,
    SampleMessagingClientDependenciesType,
    StateAction
>("counter-client", "fgr-counter")
CounterClient.setLogger(ConsoleLogger)
