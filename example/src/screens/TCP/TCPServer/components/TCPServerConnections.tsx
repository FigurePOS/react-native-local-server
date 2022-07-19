import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { getBareTCPServerActiveConnectionId, getBareTCPServerConnections } from "../selectors"
import { useSelector } from "react-redux"
import { TCPServerConnectionStateObject } from "../reducer"
import { TCPServerActiveConnection } from "./TCPServerActiveConnection"
import { HorizontalLine } from "../../../../common/components/horizontalLine"
import { TCPServerConnectionButton } from "./TCPServerConnectionButton"
import { Colors, FontSize } from "../../../../common/constants"
import { Maybe } from "../../../../types"

export const TCPServerConnections = () => {
    const connections: TCPServerConnectionStateObject[] = useSelector(getBareTCPServerConnections)
    const activeId: Maybe<string> = useSelector(getBareTCPServerActiveConnectionId)
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Text style={styles.label}>Connections: {connections.length === 0 ? "no connections" : ""}</Text>
                <ScrollView horizontal={true} alwaysBounceHorizontal={false}>
                    {connections.map((c) => (
                        <TCPServerConnectionButton
                            key={c.connectionId}
                            connection={c}
                            isActive={c.connectionId === activeId}
                        />
                    ))}
                </ScrollView>
            </View>
            <HorizontalLine />
            <TCPServerActiveConnection />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    label: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
