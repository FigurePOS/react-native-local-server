import { CallerIdServer } from "@figuredev/react-native-local-server"
import { ConsoleLogger } from "../../common/ConsoleLogger"

export const ExampleCallerIdServer = new CallerIdServer("caller-id-server")
ExampleCallerIdServer.setLogger(ConsoleLogger)
