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

TCPServer.EventEmitter.addListener(TCPServer.EventName.ConnectionAccepted, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ConnectionAccepted)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.Ready, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.Ready)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.Stopped, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.Stopped)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.MessageReceived, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.MessageReceived)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ConnectionClosed, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ConnectionClosed)
    console.log(e)
})
TCPServer.EventEmitter.addListener(TCPServer.EventName.ConnectionReady, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.ConnectionReady)
    console.log(e)
})

TCPClient.EventEmitter.addListener(TCPClient.EventName.Ready, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.Ready)
    console.log(e)
})
TCPClient.EventEmitter.addListener(TCPClient.EventName.Stopped, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.Stopped)
    console.log(e)
})
TCPClient.EventEmitter.addListener(TCPClient.EventName.MessageReceived, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.MessageReceived)
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
