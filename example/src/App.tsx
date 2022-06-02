import * as React from "react"

import { Button, StyleSheet, View } from "react-native"
import { startServer, stopServer } from "react-native-local-server"

export default function App() {
    return (
        <View style={styles.container}>
            <Button title={"Start Server"} onPress={startServer} />
            <Button title={"Stop Server"} onPress={stopServer} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
    },
})
