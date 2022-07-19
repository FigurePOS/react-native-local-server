import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { TCPServerConnectionData } from "../types"
import { Colors, FontSize } from "../../../common/constants"

type Props = {
    data: TCPServerConnectionData
}

export const TCPServerDataRow = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.source}>{props.data.from.toUpperCase()}</Text>
            <Text style={styles.data}>{props.data.data}</Text>
            <Text style={styles.timestamp}>{props.data.timestamp}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: FontSize.Medium,
        paddingVertical: FontSize.ExtraExtraSmall,
        alignItems: "center",
    },
    source: {
        fontSize: FontSize.SmallMedium,
        marginRight: FontSize.SmallMedium,
        color: Colors.GreyText,
    },
    data: {
        flex: 1,
        fontSize: FontSize.SmallMedium,
    },
    timestamp: {
        fontSize: FontSize.SmallMedium,
        color: Colors.GreyText,
        marginLeft: FontSize.SmallMedium,
    },
})
