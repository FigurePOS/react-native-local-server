import React from "react"
import { StyleSheet, View } from "react-native"
import { CounterConfiguration } from "./common/components/CounterConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { CounterView } from "./common/components/CounterView"
import { CounterLogger } from "./common/components/CounterLogger"

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
