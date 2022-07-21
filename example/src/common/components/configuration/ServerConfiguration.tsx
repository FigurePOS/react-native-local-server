import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { FormTextInput } from "../form/formTextInput"
import { Colors, FontSize } from "../../constants"
import { Button } from "../form/button"

type Props = {
    stateLabel: string
    isRunning: boolean
    initialPort: string
    style?: any

    onStarted: (port: string) => void
    onStopped: () => void
}

export const ServerConfiguration = (props: Props) => {
    const [port, setPort] = useState<string>(props.initialPort)
    return (
        <View style={[styles.container, props.style]}>
            <FormTextInput
                editable={!props.isRunning}
                label={"Port"}
                value={port}
                onChangeText={setPort}
                keyboardType={"numeric"}
                containerStyle={styles.input}
            />
            <Text style={styles.state}>{`State: ${props.stateLabel}`}</Text>
            <Button label={"Start"} onPress={() => props.onStarted(port)} />
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
    input: {
        flex: 0,
        maxWidth: 150,
    },
    state: {
        flex: 1,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
