import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

import { Maybe } from "../../../types"
import { Colors, FontSize } from "../../constants"
import { ServerConnection } from "../../types"

import { ConnectionButton } from "./ConnectionButton"

export type Props = {
    connections: ServerConnection[]
    activeConnectionId: Maybe<string>
    onConnectionPressed: (id: string) => void
    onConnectionClosePressed: (id: string) => void
}

export const ConnectionRow = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Connections: {props.connections.length === 0 ? "no connections" : ""}</Text>
            <ScrollView horizontal={true} alwaysBounceHorizontal={false}>
                {props.connections.map((c) => (
                    <ConnectionButton
                        key={c.id}
                        connection={c}
                        isActive={c.id === props.activeConnectionId}
                        onPress={props.onConnectionPressed}
                        onClosed={props.onConnectionClosePressed}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },

    label: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
