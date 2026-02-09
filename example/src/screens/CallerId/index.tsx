import React from "react"
import { StyleSheet, View } from "react-native"

import { HorizontalLine } from "../../common/components/horizontalLine"

import { CallerIDConfiguration } from "./components/CallerIDConfiguration"
import { CallerIDData } from "./components/CallerIDData"

export const CallerIDServerScreen = () => {
    return (
        <View style={styles.container}>
            <CallerIDConfiguration />
            <HorizontalLine />
            <CallerIDData />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
