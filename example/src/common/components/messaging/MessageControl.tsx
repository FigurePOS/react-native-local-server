import React, { useState } from "react"
import { StyleSheet, View } from "react-native"

import { FontSize } from "../../constants"
import { Button } from "../form/button"
import { FormTextInput } from "../form/formTextInput"

type Props = {
    onSent: (data: string) => void
}

export const MessageControl = (props: Props) => {
    const [data, setData] = useState<string>("")
    return (
        <View style={styles.container}>
            <FormTextInput placeholder={"Enter Message"} value={data} onChangeText={setData} />
            <Button
                label={"Send"}
                onPress={() => {
                    props.onSent(data)
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
})
