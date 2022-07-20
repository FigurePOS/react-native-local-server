import React from "react"
import { StyleSheet } from "react-native"
import { ServerConnection } from "../../types"
import { Button } from "../form/button"
import { Colors } from "../../constants"

type Props = {
    connection: ServerConnection
    isActive: boolean
    onPress: (id: string) => void
}

export const ConnectionButton = (props: Props) => {
    const connection = props.connection
    const isActive = props.isActive
    const id = connection.id
    const label = `${id.slice(0, 6)} (${connection.state})`
    return (
        <Button
            label={label}
            disabled={isActive}
            style={styles.button}
            labelStyle={isActive ? styles.labelActive : null}
            onPress={() => props.onPress(id)}
        />
    )
}

const styles = StyleSheet.create({
    button: {
        flex: 0,
    },
    labelActive: {
        color: Colors.GreenDark,
    },
})
