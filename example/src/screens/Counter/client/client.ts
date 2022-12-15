import { MessagingClient } from "@figuredev/react-native-local-server"
import { ConsoleLogger } from "../../../common/ConsoleLogger"

export const CounterClient = new MessagingClient("counter-client", "fgr-counter")
CounterClient.setLogger(ConsoleLogger)
