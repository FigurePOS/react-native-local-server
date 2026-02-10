import { ViewStyle } from "react-native"

export type FormComponentProps<T> = T & {
    label?: string
    labelStyle?: any
    containerStyle?: ViewStyle
}
