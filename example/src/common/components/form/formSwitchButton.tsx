import React from "react"
import { StyleSheet, Switch, SwitchProps, View } from "react-native"
import { FormComponentProps } from "./types"
import { FormLabel } from "./formLabel"

type Props = FormComponentProps<SwitchProps>

export const FormSwitchButton = (props: Props) => {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <FormLabel label={props.label} style={props.labelStyle} />
            <Switch {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
})
