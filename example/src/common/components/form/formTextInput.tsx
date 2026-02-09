import React from "react"
import { StyleSheet, TextInput, TextInputProps, View } from "react-native"

import { Colors, FontSize } from "../../constants"

import { FormLabel } from "./formLabel"
import { FormComponentProps } from "./types"

type Props = FormComponentProps<TextInputProps>

export const FormTextInput = (props: Props) => {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <FormLabel label={props.label} style={props.labelStyle} />
            <TextInput
                placeholderTextColor={Colors.GreyText}
                {...props}
                style={[styles.input, props.style, props.editable ? null : styles.disabled]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: FontSize.ExtraExtraSmall,
        marginRight: FontSize.SmallMedium,
    },
    label: {
        fontSize: FontSize.Medium,
        // padding: FontSize.Small,
        color: Colors.Black,
    },
    input: {
        flex: 1,
        fontSize: FontSize.Medium,
        padding: FontSize.ExtraSmall,
        borderRadius: FontSize.ExtraSmall,
        backgroundColor: Colors.WhiteWhite,
        color: Colors.Black,
    },
    disabled: {
        color: Colors.GreyText,
    },
})
