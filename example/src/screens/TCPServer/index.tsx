import React from "react"
import { View, StyleSheet } from "react-native"
import { TCPServerConfiguration } from "./components/TCPServerConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { TCPServerConnections } from "./components/TCPServerConnections"
import { TCPServerActiveConnection } from "./components/TCPServerActiveConnection"

export const TCPServerScreen = () => {
    return (
        <View style={styles.container}>
            <TCPServerConfiguration />
            <HorizontalLine />
            <TCPServerConnections />
            <HorizontalLine />
            <TCPServerActiveConnection />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
