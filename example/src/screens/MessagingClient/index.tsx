import React from "react"
import { StyleSheet, View } from "react-native"
import { MessagingClientConfiguration } from "./components/MessagingClientConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { MessagingClientData } from "./components/MessagingClientData"

export const MessagingClientScreen = () => {
    return (
        <View style={styles.container}>
            <MessagingClientConfiguration />
            <HorizontalLine />
            <MessagingClientData />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
