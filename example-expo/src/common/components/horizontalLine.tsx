import React from "react"
import { StyleSheet, View } from "react-native"

import { Colors } from "../constants"

type Props = {
    opacity?: number
}

export const HorizontalLine = (props: Props) => {
    const opacity =
        props.opacity != null
            ? {
                  opacity: props.opacity,
              }
            : null
    return <View style={[styles.container, opacity]} />
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        borderTopColor: Colors.Border,
        borderTopWidth: 1,
    },
})
