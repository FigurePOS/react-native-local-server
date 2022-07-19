import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { FormTextInput } from "../../../../common/components/form/formTextInput"
import { Colors, FontSize } from "../../../../common/constants"
import { Button } from "../../../../common/components/form/button"
import { useDispatch, useSelector } from "react-redux"
import {
    getBareTCPClientHost,
    getBareTCPClientPort,
    getBareTCPClientStateLabel,
    isBareTCPClientRunning,
} from "../selectors"
import { createActionBareTcpClientStartRequested, createActionBareTcpClientStopRequested } from "../actions"

export const TCPClientConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getBareTCPClientStateLabel)
    const isRunning = useSelector(isBareTCPClientRunning)
    const reduxPort = useSelector(getBareTCPClientPort)
    const reduxHost = useSelector(getBareTCPClientHost)
    const [port, setPort] = useState<string>(reduxPort ?? "")
    const [host, setHost] = useState<string>(reduxHost ?? "")
    return (
        <View style={styles.container}>
            <FormTextInput
                editable={!isRunning}
                label={"Host"}
                value={host}
                onChangeText={setHost}
                containerStyle={styles.inputHost}
            />
            <FormTextInput
                editable={!isRunning}
                label={"Port"}
                value={port}
                onChangeText={setPort}
                keyboardType={"numeric"}
                containerStyle={styles.inputPort}
            />
            <Text style={styles.state}>{`State: ${stateLabel}`}</Text>
            <Button label={"Start"} onPress={() => dispatch(createActionBareTcpClientStartRequested(host, port))} />
            <Button label={"Stop"} onPress={() => dispatch(createActionBareTcpClientStopRequested())} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    inputPort: {
        flex: 0,
        maxWidth: 170,
    },
    inputHost: {
        flex: 0,
        maxWidth: 300,
    },
    state: {
        flex: 1,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
