import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { FormTextInput } from "../form/formTextInput"
import { Button } from "../form/button"
import { Colors, FontSize } from "../../constants"

type Props = {
    stateLabel: string
    isRunning: boolean
    initialPort: string
    initialHost: string
    style?: any

    onStarted: (host: string, port: string) => void
    onStopped: () => void
}

export const ClientConfiguration = (props: Props) => {
    const [port, setPort] = useState<string>(props.initialPort)
    const [host, setHost] = useState<string>(props.initialHost)
    return (
        <View style={[styles.container, props.style]}>
            <FormTextInput
                editable={!props.isRunning}
                label={"Host"}
                value={host}
                onChangeText={setHost}
                containerStyle={styles.inputHost}
            />
            <FormTextInput
                editable={!props.isRunning}
                label={"Port"}
                value={port}
                onChangeText={setPort}
                keyboardType={"numeric"}
                containerStyle={styles.inputPort}
            />
            <Text style={styles.state}>{`State: ${props.stateLabel}`}</Text>
            <Button label={"Start"} onPress={() => props.onStarted(host, port)} />
            <Button label={"Stop"} onPress={props.onStopped} />
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
        maxWidth: 150,
    },
    inputHost: {
        flex: 0,
        maxWidth: 200,
    },
    state: {
        flex: 1,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
