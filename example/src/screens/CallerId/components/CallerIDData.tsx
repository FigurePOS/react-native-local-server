import React, { useState } from "react"
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { HorizontalLine } from "../../../common/components/horizontalLine"
import { useDispatch, useSelector } from "react-redux"
import { getCallerIDIncomingCalls } from "../selectors"
import { JSONView } from "../../../common/components/JSONView"
import { FormTextInput } from "../../../common/components/form/formTextInput"
import { Button } from "../../../common/components/form/button"
import { FontSize } from "../../../common/constants"
import { createActionCallerIdServerSimulateCallRequested } from "../actions"

export const CallerIDData = () => {
    const dispatch = useDispatch()
    const calls = useSelector(getCallerIDIncomingCalls)
    const [number, setNumber] = useState<string>("")
    const [name, setName] = useState<string>("")
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 90}
        >
            <View style={styles.container}>
                <FlatList
                    data={calls}
                    inverted={true}
                    renderItem={({ item }) => <JSONView data={item} />}
                    ItemSeparatorComponent={() => <HorizontalLine opacity={0.5} />}
                />
            </View>
            <HorizontalLine />
            <View style={styles.control}>
                <FormTextInput
                    placeholder={"Phone number"}
                    value={number}
                    keyboardType={"numeric"}
                    onChangeText={setNumber}
                />
                <FormTextInput placeholder={"Name"} value={name} onChangeText={setName} />
                <Button
                    label={"Simulate Call"}
                    onPress={() => dispatch(createActionCallerIdServerSimulateCallRequested(number, name))}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    control: {
        flexDirection: "row",
        padding: FontSize.ExtraSmall,
        alignItems: "center",
        justifyContent: "center",
    },
})
