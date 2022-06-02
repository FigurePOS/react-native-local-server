import * as React from "react"

import { Button, StyleSheet, View } from "react-native"
import { sendFromClient, sendFromServer, startClient, startServer } from "react-native-local-server"

export default function App() {
    return (
        <View style={styles.container}>
            <Button title={"Start Server"} onPress={startServer} />
            <Button title={"Send From Server"} onPress={() => sendFromServer("I am the server")} />
            <Button title={"Start Client"} onPress={startClient} />
            <Button title={"Send From Client"} onPress={() => sendFromClient("I am the client")} />
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
