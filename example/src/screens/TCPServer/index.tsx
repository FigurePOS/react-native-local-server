import React from "react"
import { StyleSheet, View } from "react-native"

import { HorizontalLine } from "../../common/components/horizontalLine"

import { TCPServerActiveConnection } from "./components/TCPServerActiveConnection"
import { TCPServerConfiguration } from "./components/TCPServerConfiguration"
import { TCPServerConnections } from "./components/TCPServerConnections"

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
