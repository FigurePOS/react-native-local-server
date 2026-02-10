import React, { PropsWithChildren } from "react"
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"

import { HorizontalLine } from "../horizontalLine"

import { MessageRow } from "./MessageRow"
import { MessageData } from "./types"

type Props = PropsWithChildren<{
    data: MessageData[]
}>

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
                {props.children}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
