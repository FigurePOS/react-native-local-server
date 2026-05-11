import { combineHandlers } from "@figuredev/react-native-local-server"

import handlers from "./handlers"

export const rootHandler = combineHandlers(...handlers)
