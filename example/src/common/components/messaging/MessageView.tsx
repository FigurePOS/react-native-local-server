import React from "react"
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { MessageData } from "./types"
import { MessageRow } from "./MessageRow"
import { HorizontalLine } from "../horizontalLine"
import { MessageControl } from "./MessageControl"

type Props = {
    data: MessageData[]
    onSent: (message: string) => void
}

export const MessageView = (props: Props) => {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 90}
        >
            <View style={styles.container}>
                <FlatList
                    data={props.data}
                    inverted={true}
                    renderItem={({ item }) => <MessageRow data={item} />}
                    ItemSeparatorComponent={() => <HorizontalLine opacity={0.5} />}
                />
                <HorizontalLine />
                <MessageControl onSent={props.onSent} />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
