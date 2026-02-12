import React, { useCallback } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { Colors, FontSize, FontWeight } from "../../constants"
import { Icon, IconNames } from "../icon"

import { LoggerMessageComponent } from "./loggerMessage"
import { LoggerMessage } from "./types"

type Props = {
    name: string
    data: LoggerMessage[]
    onClearPressed: () => void
}

export const LoggerView = (props: Props) => {
    const renderItem = useCallback(({ item }: { item: LoggerMessage }) => {
        return <LoggerMessageComponent message={item} />
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.nameContainer}>
                <Text style={styles.nameLabel}>{props.name}</Text>
                <TouchableOpacity onPress={props.onClearPressed}>
                    <Icon name={IconNames.clear} size={FontSize.Big} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={props.data}
                renderItem={renderItem}
                inverted={true}
                contentContainerStyle={styles.scrollContent}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: Colors.Border,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        backgroundColor: Colors.WhiteWhite,
    },
    scrollContent: {
        paddingTop: FontSize.Big, // it's bottom because flat list is inverted
    },
    nameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: FontSize.ExtraSmall,
        borderBottomWidth: 1,
        borderColor: Colors.Border,
    },
    nameLabel: {
        fontSize: FontSize.MediumBig,
        fontWeight: FontWeight.Medium,
        textAlign: "center",
    },
})
