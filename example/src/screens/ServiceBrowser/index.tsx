import React, { useEffect } from "react"
import { Button, StyleSheet, View } from "react-native"
import { BareServiceBrowser } from "./network"
import { ServiceBrowser, ServiceBrowserEventName } from "@figuredev/react-native-local-server"

export const ServiceBrowserScreen = () => {
    useEffect(() => {
        ServiceBrowser.EventEmitter.addListener(ServiceBrowserEventName.Started, (e) => {
            console.log("ServiceBrowser Started", e)
        })
        ServiceBrowser.EventEmitter.addListener(ServiceBrowserEventName.Stopped, (e) => {
            console.log("ServiceBrowser Stopped", e)
        })
        ServiceBrowser.EventEmitter.addListener(ServiceBrowserEventName.ServiceFound, (e) => {
            console.log("ServiceBrowser ServiceFound", e)
        })
        ServiceBrowser.EventEmitter.addListener(ServiceBrowserEventName.ServiceLost, (e) => {
            console.log("ServiceBrowser ServiceLost", e)
        })
    })
    return (
        <View style={styles.container}>
            <Button
                title={"Start"}
                onPress={() => {
                    BareServiceBrowser.start({ type: "_fgr-counter._tcp" })
                }}
            />
            <Button
                title={"Stop"}
                onPress={() => {
                    BareServiceBrowser.stop()
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
