import { MessagingClient } from "@figuredev/react-native-local-server"
import { CounterLogger } from "../common/logger"

export const CounterClient = new MessagingClient("counter-client")
CounterClient.setLogger(CounterLogger)
