import { combineHandlers } from "react-native-local-server"
import handlers from "./handlers"

export const rootHandler = combineHandlers(...handlers)
