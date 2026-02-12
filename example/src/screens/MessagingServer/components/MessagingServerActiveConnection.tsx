import React, { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"

import { MessageControl } from "../../../common/components/messaging/MessageControl"
import { MessageView } from "../../../common/components/messaging/MessageView"
import { MessageData } from "../../../common/components/messaging/types"
import { Colors, FontSize } from "../../../common/constants"
import { Maybe } from "../../../types"
import { createActionMessagingServerSendMessageRequested } from "../actions"
import { getMessagingServerActiveConnectionData, getMessagingServerActiveConnectionId } from "../selectors"

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
        [dispatch, connectionId],
    )
    if (data === null || data === undefined) {
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
