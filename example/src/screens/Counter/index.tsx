import React from "react"
import { StyleSheet, View } from "react-native"

import { HorizontalLine } from "../../common/components/horizontalLine"

import { CounterConfiguration } from "./common/components/CounterConfiguration"
import { CounterLogger } from "./common/components/CounterLogger"
import { CounterView } from "./common/components/CounterView"

export const CounterScreen = () => {
    return (
        <View style={styles.container}>
            <CounterConfiguration />
            <HorizontalLine />
            <View style={styles.row}>
                <CounterView />
                <CounterLogger />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
})
