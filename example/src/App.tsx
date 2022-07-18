import "react-native-gesture-handler"
import * as React from "react"
import { Button, StyleSheet, View } from "react-native"
import { TCPClient, TCPServer } from "react-native-local-server"
import { NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"

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
TCPServer.EventEmitter.addListener(TCPServer.EventName.DataReceived, (e) => {
    console.log("SERVER")
    console.log(TCPServer.EventName.DataReceived)
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
TCPClient.EventEmitter.addListener(TCPClient.EventName.DataReceived, (e) => {
    console.log("CLIENT")
    console.log(TCPClient.EventName.DataReceived)
    console.log(e)
})

const Drawer = createDrawerNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName={"TCP Server"}>
                <Drawer.Screen name={"TCP Server"} component={() => <View />} />
                <Drawer.Screen name={"TCP Client"} component={() => <View />} />
            </Drawer.Navigator>
            {/*<View style={styles.container}>*/}
            {/*    <Button*/}
            {/*        title={"Start Server"}*/}
            {/*        onPress={() => {*/}
            {/*            server.start().catch(() => {})*/}
            {/*        }}*/}
            {/*    />*/}
            {/*    <Button title={"Stop Server"} onPress={server.stop} />*/}
            {/*    <Button title={"Send From Server"} onPress={() => server.broadcastMessage("I am the server")} />*/}
            {/*    <Button title={"Start Client"} onPress={client.start} />*/}
            {/*    <Button title={"Stop Client"} onPress={client.stop} />*/}
            {/*    <Button title={"Send From Client"} onPress={() => client.sendMessage("I am the client")} />*/}
            {/*</View>*/}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
    },
})
