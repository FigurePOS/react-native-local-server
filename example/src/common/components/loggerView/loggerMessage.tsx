import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { Colors, FontSize, FontWeight } from "../../constants"
import JSONTree from "react-native-json-tree"
import { LoggerMessage } from "./types"

type Props = {
    message: LoggerMessage
}

const jsonTheme = {
    scheme: "monokai",
    author: "wimer hazenberg (http://www.monokai.nl)",
    base00: "#000",
    base01: "#383830",
    base02: "#49483e",
    base03: "#75715e",
    base04: "#a59f85",
    base05: "#f8f8f2",
    base06: "#f5f4f1",
    base07: "#f9f8f5",
    base08: "#f92672",
    base09: "#fd971f",
    base0A: "#f4bf75",
    base0B: "#a6e22e",
    base0C: "#a1efe4",
    base0D: "#66d9ef",
    base0E: "#ae81ff",
    base0F: "#cc6633",
}

export const LoggerMessageComponent = (props: Props) => {
    const { message } = props
    let extraStyle: any = null
    switch (message.type) {
        case "warn":
            extraStyle = styles.warn
            break
        case "error":
            extraStyle = styles.error
            break
    }
    return (
        <View style={styles.container}>
            <Text style={[styles.message, extraStyle]}>{message.message}</Text>
            {message.data ? <JSONTree data={message.data} theme={jsonTheme} invertTheme={true} /> : null}
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
