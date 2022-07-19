import React, { useCallback } from "react"
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native"
import { Maybe } from "../../../../types"
import { TCPServerConnectionStateObject } from "../reducer"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPServerActiveConnection } from "../selectors"
import { Colors, FontSize } from "../../../../common/constants"
import { TCPDataRow } from "../../common/components/TCPDataRow"
import { HorizontalLine } from "../../../../common/components/horizontalLine"
import { createActionBareTcpServerDataSendRequested } from "../actions"
import { TCPControlRow } from "../../common/components/TCPControlRow"

export const TCPServerActiveConnection = () => {
    const dispatch = useDispatch()
    const activeConnection: Maybe<TCPServerConnectionStateObject> = useSelector(getBareTCPServerActiveConnection)
    const connectionId = activeConnection?.connectionId
    const onDataSent = useCallback(
        (data: string) => {
            if (connectionId) {
                dispatch(createActionBareTcpServerDataSendRequested(connectionId, data))
            }
        },
        [dispatch, connectionId]
    )
    if (!activeConnection) {
        return (
            <View style={styles.noConnectionContainer}>
                <Text style={styles.noConnectionLabel}>No Active Connection</Text>
            </View>
        )
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 140}
        >
            <View style={styles.container}>
                <FlatList
                    data={activeConnection.data}
                    inverted={true}
                    renderItem={({ item }) => <TCPDataRow data={item} />}
                    ItemSeparatorComponent={() => <HorizontalLine opacity={0.5} />}
                />
                <HorizontalLine />
                <TCPControlRow onSent={onDataSent} />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noConnectionContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    noConnectionLabel: {
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.GreyText,
    },
})
