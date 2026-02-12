import { combineHandlers } from "@figuredev/react-native-local-server"

import handlers from "./handlers"

// @ts-expect-error - I don't know what to do with this
export const rootHandler = combineHandlers(...handlers)
