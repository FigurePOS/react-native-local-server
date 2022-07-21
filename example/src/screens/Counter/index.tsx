import React from "react"
import { View, StyleSheet } from "react-native"
import { CounterConfiguration } from "./components/CounterConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { CounterView } from "./components/CounterView"

export const CounterScreen = () => {
    return (
        <View style={styles.container}>
            <CounterConfiguration />
            <HorizontalLine />
            <CounterView />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
