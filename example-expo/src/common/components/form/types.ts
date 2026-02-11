import { TextStyle, ViewStyle } from "react-native"

export type FormComponentProps<T> = T & {
    label?: string
    labelStyle?: TextStyle
    containerStyle?: ViewStyle
}
