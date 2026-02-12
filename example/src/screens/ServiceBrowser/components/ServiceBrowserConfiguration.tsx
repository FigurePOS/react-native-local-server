import React, { useState } from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"

import { Button } from "../../../common/components/form/button"
import { FormTextInput } from "../../../common/components/form/formTextInput"
import { Colors, FontSize } from "../../../common/constants"

type Props = {
    stateLabel: string
    isRunning: boolean
    groupName: string
    style?: ViewStyle

    onStarted: (groupName: string) => void
    onStopped: () => void
    onRestart?: () => void
}

export const ServiceBrowserConfiguration = (props: Props) => {
    const [group, setGroup] = useState<string>(props.groupName)

    return (
        <View style={[styles.container, props.style]}>
            <FormTextInput
                editable={!props.isRunning}
                label={"Group"}
                value={group}
                onChangeText={setGroup}
                containerStyle={styles.input}
            />
            <Text style={styles.info}>{`State: ${props.stateLabel}`}</Text>
            <View style={styles.space} />
            {props.onRestart ? <Button label={"Restart"} onPress={props.onRestart} /> : null}
            <Button label={"Start"} onPress={() => props.onStarted(group)} />
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
        maxWidth: 350,
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
