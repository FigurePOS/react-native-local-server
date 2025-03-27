import React, { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Maybe } from "../../../types"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPServerActiveConnectionData, getBareTCPServerActiveConnectionId } from "../selectors"
import { Colors, FontSize } from "../../../common/constants"
import { createActionBareTcpServerDataSendRequested } from "../actions"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { MessageData } from "../../../common/components/messaging/types"
import { MessageControl } from "../../../common/components/messaging/MessageControl"

export const TCPServerActiveConnection = () => {
    const dispatch = useDispatch()
    const data: Maybe<MessageData[]> = useSelector(getBareTCPServerActiveConnectionData)
    const connectionId = useSelector(getBareTCPServerActiveConnectionId)
    const onDataSent = useCallback(
        (d: string) => {
            if (connectionId) {
                dispatch(createActionBareTcpServerDataSendRequested(connectionId, d))
            }
        },
        [dispatch, connectionId],
    )
    if (data == null) {
        return (
            <View style={styles.noConnectionContainer}>
                <Text style={styles.noConnectionLabel}>No Active Connection</Text>
            </View>
        )
    }
    // 120 140
    return (
        <MessageView data={data}>
            <MessageControl onSent={onDataSent} />
        </MessageView>
    )
}

const styles = StyleSheet.create({
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
