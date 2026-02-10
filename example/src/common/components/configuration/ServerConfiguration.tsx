import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"

import { Maybe } from "../../../types"
import { Colors, FontSize } from "../../constants"
import { Button } from "../form/button"
import { FormTextInput } from "../form/formTextInput"

type Props = {
    stateLabel: string
    isRunning: boolean
    initialPort: Maybe<string>
    ipAddress: Maybe<string>
    style?: ViewStyle

    onStarted: (port: string) => void
    onStopped: () => void
    onRestart?: () => void
}

export const ServerConfiguration = (props: Props) => {
    const [port, setPort] = useState<Maybe<string>>(props.initialPort)
    useEffect(() => {
        setPort(props.initialPort)
    }, [props.initialPort, setPort])
    return (
        <View style={[styles.container, props.style]}>
            {port != null ? (
                <FormTextInput
                    editable={!props.isRunning}
                    label={"Port"}
                    value={port}
                    onChangeText={setPort}
                    keyboardType={"numeric"}
                    containerStyle={styles.input}
                />
            ) : null}
            <Text style={styles.info}>{`IP: ${props.ipAddress ?? "UNKNOWN"}`}</Text>
            <Text style={styles.info}>{`State: ${props.stateLabel}`}</Text>
            <View style={styles.space} />
            {props.onRestart ? <Button label={"Restart"} onPress={props.onRestart} /> : null}
            <Button label={"Start"} onPress={() => props.onStarted(port ?? "")} />
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
    info: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
    space: {
        flex: 1,
    },
})
