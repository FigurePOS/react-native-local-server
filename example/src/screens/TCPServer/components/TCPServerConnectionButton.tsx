import React from "react"
import { StyleSheet } from "react-native"
import { TCPServerConnectionStateObject } from "../reducer"
import { Button } from "../../../common/components/form/button"
import { useDispatch } from "react-redux"
import { createActionBareTcpServerActiveConnectionChanged } from "../actions"
import { Colors } from "../../../common/constants"

type Props = {
    connection: TCPServerConnectionStateObject
    isActive: boolean
}

export const TCPServerConnectionButton = (props: Props) => {
    const dispatch = useDispatch()
    const connection = props.connection
    const isActive = props.isActive
    const id = connection.connectionId
    const label = `${id.slice(0, 6)} (${connection.state})`
    return (
        <Button
            label={label}
            disabled={isActive}
            style={styles.button}
            labelStyle={isActive ? styles.labelActive : null}
            onPress={() => dispatch(createActionBareTcpServerActiveConnectionChanged(id))}
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
