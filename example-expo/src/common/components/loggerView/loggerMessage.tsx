import React from "react"
import { StyleSheet, Text, TextStyle, View } from "react-native"

import { Colors, FontSize, FontWeight } from "../../constants"
import { JSONView } from "../JSONView"

import { LoggerMessage } from "./types"

type Props = {
    message: LoggerMessage
}

export const LoggerMessageComponent = (props: Props) => {
    const { message } = props
    let extraStyle: TextStyle | null = null
    switch (message.type) {
        case "warn":
            extraStyle = styles.warn
            break
        case "error":
        default:
            extraStyle = styles.error
            break
    }
    return (
        <View style={styles.container}>
            <Text style={[styles.message, extraStyle]}>{message.message}</Text>
            {message.data ? <JSONView data={message.data} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    message: {
        fontSize: FontSize.SmallMedium,
        fontWeight: FontWeight.Light,
        color: Colors.Black,
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
    error: {
        color: Colors.Error,
    },
    warn: {
        color: Colors.Warning,
    },
})
