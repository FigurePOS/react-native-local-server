import React from "react"
import { StyleSheet, View } from "react-native"
import { ServerConnection } from "../../types"
import { Button } from "../form/button"
import { Colors } from "../../constants"

type Props = {
    connection: ServerConnection
    isActive: boolean
    onPress: (id: string) => void
    onClosed: (id: string) => void
}

export const ConnectionButton = (props: Props) => {
    const connection = props.connection
    const isActive = props.isActive
    const id = connection.id
    const label = `${id.slice(0, 6)} (${connection.state})`
    return (
        <View style={styles.container}>
            <Button
                label={label}
                disabled={isActive}
                style={styles.button}
                labelStyle={isActive ? styles.labelActive : null}
                onPress={() => props.onPress(id)}
            />
            {isActive ? (
                <Button
                    label={"X"}
                    style={styles.button}
                    labelStyle={styles.closeLabel}
                    onPress={() => props.onClosed(id)}
                />
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    button: {
        flex: 0,
    },
    labelActive: {
        color: Colors.GreenDark,
    },
    closeLabel: {
        color: Colors.Error,
        paddingLeft: 0,
    },
})
