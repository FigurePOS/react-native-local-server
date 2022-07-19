import React, { useCallback, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { FormTextInput } from "../../common/components/form/formTextInput"
import { Colors, FontSize } from "../../common/constants"
import { Button } from "../../common/components/form/button"
import { useDispatch, useSelector } from "react-redux"
import { createActionBareTcpServerStartRequested, createActionBareTcpServerStopRequested } from "./actions"
import { getBareTCPServerStateLabel, isBareTCPServerRunning } from "./selectors"

export const TCPServerConfiguration = () => {
    const dispatch = useDispatch()
    const stateLabel = useSelector(getBareTCPServerStateLabel)
    const isRunning = useSelector(isBareTCPServerRunning)

    const [port, setPort] = useState<string>("")

    const onButtonPressed = useCallback(() => {
        const action = isRunning
            ? createActionBareTcpServerStopRequested()
            : createActionBareTcpServerStartRequested(port)
        dispatch(action)
    }, [isRunning, dispatch, port])

    return (
        <View style={styles.container}>
            <FormTextInput
                editable={!isRunning}
                label={"Port"}
                value={port}
                onChangeText={setPort}
                keyboardType={"numeric"}
                containerStyle={styles.input}
            />
            <Text style={styles.state}>{`State: ${stateLabel}`}</Text>
            <Button label={`${isRunning ? "Stop" : "Start"} Server`} onPress={onButtonPressed} />
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
        maxWidth: 200,
    },
    state: {
        flex: 1,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
