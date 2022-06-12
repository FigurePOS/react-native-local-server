import * as React from "react"

import { Button, StyleSheet, View } from "react-native"
import { LocalMessagingClient, LocalMessagingServer } from "react-native-local-server"

const client = new LocalMessagingClient({
    id: "client-1",
    host: "localhost",
    port: 12000,
})

const server = new LocalMessagingServer({
    id: "server-1",
    port: 12000,
})

export default function App() {
    return (
        <View style={styles.container}>
            <Button title={"Start Server"} onPress={server.start} />
            <Button title={"Stop Server"} onPress={server.stop} />
            <Button title={"Send From Server"} onPress={() => server.broadcastMessage("I am the server")} />
            <Button title={"Start Client"} onPress={client.start} />
            <Button title={"Stop Client"} onPress={client.stop} />
            <Button title={"Send From Client"} onPress={() => client.sendMessage("I am the client")} />
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
