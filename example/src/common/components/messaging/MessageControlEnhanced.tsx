import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { FormTextInput } from "../form/formTextInput"
import { Button } from "../form/button"
import { FontSize } from "../../constants"

type Props = {
    onSent: (host: string, port: number, data: string) => void
}

export const MessageControlEnhanced = (props: Props) => {
    const [host, setHost] = useState<string>("")
    const [port, setPort] = useState<string>("")
    const [data, setData] = useState<string>("")
    return (
        <View style={styles.container}>
            <FormTextInput placeholder={"Host"} value={host} containerStyle={styles.host} onChangeText={setHost} />
            <FormTextInput placeholder={"Port"} value={port} containerStyle={styles.port} onChangeText={setPort} />
            <FormTextInput
                placeholder={"Enter Message"}
                value={data}
                containerStyle={styles.message}
                onChangeText={setData}
            />
            <Button
                label={"Send"}
                onPress={() => {
                    props.onSent(host, Number.parseInt(port, 10), data)
                    setData("")
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: FontSize.ExtraSmall,
        alignItems: "center",
        justifyContent: "center",
    },
    host: {
        flex: 2,
    },
    port: {
        flex: 1,
    },
    message: {
        flex: 4,
    },
})
