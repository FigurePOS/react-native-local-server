import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { MessagingClientServiceSearchResult } from "@figuredev/react-native-local-server"
import { Button } from "../form/button"
import { Colors, FontSize } from "../../constants"

type Props = {
    stateLabel: string
    services: MessagingClientServiceSearchResult[]
    style?: any

    onStarted: () => void
    onStopped: () => void
    onRestart?: () => void
}

export const SearchConfiguration = (props: Props) => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, props.style]}>
                <Text style={styles.state}>{`State: ${props.stateLabel}`}</Text>
                <View style={styles.space} />

                {props.onRestart ? <Button label={"Restart"} onPress={props.onRestart} /> : null}
                <Button label={"Start"} onPress={props.onStarted} />
                <Button label={"Stop"} onPress={props.onStopped} />
            </View>
            <View style={styles.row}>
                <Text style={styles.state}>Services:</Text>
                {props.services.map((service) => (
                    <Button key={service.shortId} label={`${service.name} (${service.shortId})`} onPress={() => {}} />
                ))}
                {props.services.length === 0 ? <Text style={styles.state}>No services found</Text> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 90,
        justifyContent: "space-evenly",
    },
    row: {
        flex: 0,
        flexDirection: "row",
    },
    state: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
    space: {
        flex: 1,
    },
})
