import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { FormTextInput } from "../../../../common/components/form/formTextInput"
import { Button } from "../../../../common/components/form/button"
import { FontSize } from "../../../../common/constants"

type Props = {
    onSent: (data: string) => void
}

export const TCPControlRow = (props: Props) => {
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
