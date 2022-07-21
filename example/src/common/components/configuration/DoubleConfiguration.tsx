import React from "react"
import { StyleSheet, View } from "react-native"
import { ServerConfiguration } from "./ServerConfiguration"
import { ClientConfiguration } from "./ClientConfiguration"
import { HorizontalLine } from "../horizontalLine"
import { Text } from "react-native"
import { Colors, FontSize } from "../../constants"

type Props = {
    stateLabelServer: string
    initialPortServer: string

    stateLabelClient: string
    initialPortClient: string
    initialHostClient: string

    isRunning: boolean

    onClientStarted: (host: string, port: string) => void
    onClientStopped: () => void
    onServerStarted: (port: string) => void
    onServerStopped: () => void
}

export const DoubleConfiguration = (props: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Server: </Text>
                <ServerConfiguration
                    style={styles.flex}
                    stateLabel={props.stateLabelServer}
                    isRunning={props.isRunning}
                    initialPort={props.initialPortServer}
                    onStarted={props.onServerStarted}
                    onStopped={props.onServerStopped}
                />
            </View>
            <HorizontalLine opacity={0.5} />
            <View style={styles.row}>
                <Text style={styles.label}>Client: </Text>
                <ClientConfiguration
                    style={styles.flex}
                    stateLabel={props.stateLabelClient}
                    isRunning={props.isRunning}
                    initialPort={props.initialPortClient}
                    initialHost={props.initialHostClient}
                    onStarted={props.onClientStarted}
                    onStopped={props.onClientStopped}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    flex: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        width: 90,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
