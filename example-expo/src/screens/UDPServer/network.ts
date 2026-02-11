import { UDPServer } from "@figuredev/react-native-local-server"

import { ConsoleLogger } from "../../common/ConsoleLogger"

export const BareUDPServer = new UDPServer("bare-udp-server")
BareUDPServer.setLogger(ConsoleLogger)
