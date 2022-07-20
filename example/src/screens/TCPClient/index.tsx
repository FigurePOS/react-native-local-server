import React from "react"
import { View, StyleSheet } from "react-native"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { TCPClientConfiguration } from "./components/TCPClientConfiguration"
import { TCPClientData } from "./components/TCPClientData"

export const TCPClientScreen = () => {
    return (
        <View style={styles.container}>
            <TCPClientConfiguration />
            <HorizontalLine />
            <TCPClientData />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
