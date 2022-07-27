import { MessagingServer } from "@figuredev/react-native-local-server"
import { CounterLogger } from "../common/logger"

export const CounterServer = new MessagingServer("counter-server")
CounterServer.setLogger(CounterLogger)
