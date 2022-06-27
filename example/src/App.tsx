import * as React from "react"
import { Button, StyleSheet, View } from "react-native"
import { TCPClient, TCPServer } from "react-native-local-server"

const client = new TCPClient({
    id: "client-1",
    host: "localhost",
    port: 12000,
})

const server = new TCPServer({
    id: "server-1",
    port: 12000,
})

TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerConnectionAccepted, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerConnectionAccepted)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerReady, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerReady)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerStopped, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerStopped)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerReceivedMessage, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerReceivedMessage)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerConnectionClosed, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerConnectionClosed)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ServerConnectionReady, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ServerConnectionReady)
    console.log(e)
})

TCPClient.EventEmitter.addListener(TCPClient.EventName.ClientReady, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.ClientReady)
    console.log(e)
})
TCPClient.EventEmitter.addListener(TCPClient.EventName.ClientStopped, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.ClientStopped)
    console.log(e)
})
TCPClient.EventEmitter.addListener(TCPClient.EventName.ClientReceivedMessage, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.ClientReceivedMessage)
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
