import React from "react"
import { StyleSheet, View } from "react-native"

import { HorizontalLine } from "../../common/components/horizontalLine"

import { MessagingServerActiveConnection } from "./components/MessagingServerActiveConnection"
import { MessagingServerConfiguration } from "./components/MessagingServerConfiguration"
import { MessagingServerConnections } from "./components/MessagingServerConnections"

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
