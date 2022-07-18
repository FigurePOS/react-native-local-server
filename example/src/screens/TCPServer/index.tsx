import React from "react"
import { View, StyleSheet } from "react-native"
import { TCPServerConfiguration } from "./TCPServerConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"

export const TCPServerScreen = () => {
    return (
        <View style={styles.container}>
            <TCPServerConfiguration />
            <HorizontalLine />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
