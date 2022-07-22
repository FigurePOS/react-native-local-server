import { MessagingClient } from "react-native-local-server"
import { CounterLogger } from "../common/logger"

export const CounterClient = new MessagingClient("counter-client")
CounterClient.setLogger(CounterLogger)
