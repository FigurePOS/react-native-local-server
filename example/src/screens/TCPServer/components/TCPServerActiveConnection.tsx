import React, { useCallback, useState } from "react"
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native"
import { Maybe } from "../../../types"
import { TCPServerConnectionStateObject } from "../reducer"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPServerActiveConnection } from "../selectors"
import { Colors, FontSize } from "../../../common/constants"
import { TCPServerDataRow } from "./TCPServerDataRow"
import { HorizontalLine } from "../../../common/components/horizontalLine"
import { FormTextInput } from "../../../common/components/form/formTextInput"
import { Button } from "../../../common/components/form/button"
import { createActionBareTcpServerDataSendRequested } from "../actions"

export const TCPServerActiveConnection = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState<string>("")
    const activeConnection: Maybe<TCPServerConnectionStateObject> = useSelector(getBareTCPServerActiveConnection)
    const connectionId = activeConnection?.connectionId
    const onDataSent = useCallback(() => {
        if (connectionId) {
            dispatch(createActionBareTcpServerDataSendRequested(connectionId, data))
        }
        setData("")
    }, [dispatch, setData, data, connectionId])
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
                    renderItem={({ item }) => <TCPServerDataRow data={item} />}
                    ItemSeparatorComponent={() => <HorizontalLine opacity={0.5} />}
                />
                <HorizontalLine />
                <View style={styles.controlContainer}>
                    <FormTextInput placeholder={"Enter Message"} value={data} onChangeText={setData} />
                    <Button label={"Send"} onPress={onDataSent} />
                </View>
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
    controlContainer: {
        flexDirection: "row",
        padding: FontSize.ExtraSmall,
        alignItems: "center",
        justifyContent: "center",
    },
})
