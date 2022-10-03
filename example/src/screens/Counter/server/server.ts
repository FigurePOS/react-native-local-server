import { MessagingServer } from "@figuredev/react-native-local-server"
import { ConsoleLogger } from "../../../common/ConsoleLogger"

export const CounterServer = new MessagingServer("counter-server")
CounterServer.setLogger(ConsoleLogger)
