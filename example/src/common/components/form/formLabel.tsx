import React from "react"
import { StyleSheet, Text } from "react-native"

import { Colors, FontSize } from "../../constants"

type Props = {
    label: string | null | undefined
    style?: any
}

export const FormLabel = (props: Props) => {
    if (!props.label) {
        return null
    }
    return <Text style={[styles.label, props.style]}>{`${props.label}: `}</Text>
}

const styles = StyleSheet.create({
    label: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
