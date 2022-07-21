import React from "react"
import { View, StyleSheet } from "react-native"
import { MessagingServerConfiguration } from "./components/MessagingServerConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { MessagingServerConnections } from "./components/MessagingServerConnections"
import { MessagingServerActiveConnection } from "./components/MessagingServerActiveConnection"

export const MessagingServerScreen = () => {
    return (
        <View style={styles.container}>
            <MessagingServerConfiguration />
            <HorizontalLine />
            <MessagingServerConnections />
            <HorizontalLine />
            <MessagingServerActiveConnection />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
