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

LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerConnectionAccepted, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerConnectionAccepted)
    console.log(e)
})
LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerReady, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerReady)
    console.log(e)
})
LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerStopped, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerStopped)
    console.log(e)
})
LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerReceivedMessage, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerReceivedMessage)
    console.log(e)
})
LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerConnectionClosed, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerConnectionClosed)
    console.log(e)
})
LocalMessagingServer.EventEmitter.addListener(LocalMessagingServer.EventName.ServerConnectionReady, (e) => {
    console.log("SERVER")
    console.log(LocalMessagingServer.EventName.ServerConnectionReady)
    console.log(e)
})

LocalMessagingClient.EventEmitter.addListener(LocalMessagingClient.EventName.ClientReady, (e) => {
    console.log("CLIENT")
    console.log(LocalMessagingClient.EventName.ClientReady)
    console.log(e)
})
LocalMessagingClient.EventEmitter.addListener(LocalMessagingClient.EventName.ClientStopped, (e) => {
    console.log("CLIENT")
    console.log(LocalMessagingClient.EventName.ClientStopped)
    console.log(e)
})
LocalMessagingClient.EventEmitter.addListener(LocalMessagingClient.EventName.ClientReceivedMessage, (e) => {
    console.log("CLIENT")
    console.log(LocalMessagingClient.EventName.ClientReceivedMessage)
    console.log(e)
})

export default function App() {
    return (
        <View style={styles.container}>
            <Button
                title={"Start Server"}
                onPress={() => {
                    server.start().catch(() => {})
                }}
            />
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
