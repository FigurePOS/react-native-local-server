import React from "react"
import { View, StyleSheet, Platform, FlatList, KeyboardAvoidingView } from "react-native"
import { TCPDataRow } from "../../common/components/TCPDataRow"
import { HorizontalLine } from "../../../../common/components/horizontalLine"
import { TCPControlRow } from "../../common/components/TCPControlRow"
import { useDispatch, useSelector } from "react-redux"
import { getBareTCPClientData } from "../selectors"
import { createActionBareTcpClientDataSendRequested } from "../actions"

export const TCPClientData = () => {
    const dispatch = useDispatch()
    const data = useSelector(getBareTCPClientData)
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 90}
        >
            <View style={styles.container}>
                <FlatList
                    data={data}
                    inverted={true}
                    renderItem={({ item }) => <TCPDataRow data={item} />}
                    ItemSeparatorComponent={() => <HorizontalLine opacity={0.5} />}
                />
                <HorizontalLine />
                <TCPControlRow onSent={(d) => dispatch(createActionBareTcpClientDataSendRequested(d))} />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
