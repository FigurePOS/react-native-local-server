import React from "react"
import { StyleSheet, View } from "react-native"
import { UDPServerConfiguration } from "./components/UDPServerConfiguration"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { BareUDPServerData } from "./components/UDPServerData"

export const UDPServerScreen = () => {
    return (
        <View style={styles.container}>
            <UDPServerConfiguration />
            <HorizontalLine />
            <BareUDPServerData />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
