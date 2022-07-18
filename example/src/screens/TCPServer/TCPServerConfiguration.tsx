import React, { useCallback, useState } from "react"
import { Text } from "react-native"
import { StyleSheet, View } from "react-native"
import { FormTextInput } from "../../common/components/form/formTextInput"
import { Colors, FontSize } from "../../common/constants"
import { Button } from "../../common/components/form/button"
import { useDispatch, useSelector } from "react-redux"
import { createActionTcpServerStartRequested, createActionTcpServerStopRequested } from "./actions"
import { getTCPServerState, isTCPServerRunning } from "./selectors"

export const TCPServerConfiguration = () => {
    const dispatch = useDispatch()
    const state = useSelector(getTCPServerState)
    const isRunning = useSelector(isTCPServerRunning)
    const onButtonPressed = useCallback(() => {
        const action = isRunning ? createActionTcpServerStopRequested() : createActionTcpServerStartRequested()
        dispatch(action)
    }, [isRunning, dispatch])
    const [port, setPort] = useState<string>("")
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
            <Text style={styles.state}>{`State: ${state}`}</Text>
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
