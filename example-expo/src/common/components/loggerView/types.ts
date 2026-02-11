import { Renderable } from "react-native-json-tree"

export type LoggerMessage = {
    type: "info" | "warn" | "error"
    message: string
    data: Renderable
}
