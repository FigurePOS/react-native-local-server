import React from "react"
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from "react-native"
import { FormComponentProps } from "./types"
import { Colors, FontSize } from "../../constants"

type Props = FormComponentProps<TouchableOpacityProps>

export const Button = (props: Props) => {
    return (
        <TouchableOpacity style={[styles.container, props.containerStyle]} {...props}>
            <Text style={[styles.label, props.labelStyle, props.disabled ? styles.labelDisabled : null]}>
                {props.label}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    label: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Primary,
    },
    labelDisabled: {
        color: Colors.GreyText,
    },
})
