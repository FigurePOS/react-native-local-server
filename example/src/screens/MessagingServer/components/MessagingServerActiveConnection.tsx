import React, { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Maybe } from "../../../types"
import { useDispatch, useSelector } from "react-redux"
import { getMessagingServerActiveConnectionData, getMessagingServerActiveConnectionId } from "../selectors"
import { Colors, FontSize } from "../../../common/constants"
import { createActionMessagingServerSendMessageRequested } from "../actions"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { MessageData } from "../../../common/components/messaging/types"

export const MessagingServerActiveConnection = () => {
    const dispatch = useDispatch()
    const data: Maybe<MessageData[]> = useSelector(getMessagingServerActiveConnectionData)
    const connectionId = useSelector(getMessagingServerActiveConnectionId)
    const onDataSent = useCallback(
        (d: string) => {
            if (connectionId) {
                dispatch(createActionMessagingServerSendMessageRequested(connectionId, d))
            }
        },
        [dispatch, connectionId]
    )
    if (data === null || data === undefined) {
        return (
            <View style={styles.noConnectionContainer}>
                <Text style={styles.noConnectionLabel}>No Active Connection</Text>
            </View>
        )
    }
    // 120 140
    return <MessageView data={data} onSent={onDataSent} />
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
