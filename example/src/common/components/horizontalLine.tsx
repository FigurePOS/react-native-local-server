import React from "react"
import { View, StyleSheet } from "react-native"
import { Colors } from "../constants"

export const HorizontalLine = () => {
    return <View style={styles.container} />
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        borderTopColor: Colors.Border,
        borderTopWidth: 1,
    },
})
