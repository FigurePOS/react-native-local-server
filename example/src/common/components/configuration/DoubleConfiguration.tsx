import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ServerConfiguration } from "./ServerConfiguration"
import { ClientConfiguration } from "./ClientConfiguration"
import { HorizontalLine } from "../horizontalLine"
import { Colors, FontSize } from "../../constants"
import { Maybe } from "../../../types"
import { SearchConfiguration } from "./SearchConfiguration"
import { MessagingClientServiceSearchResult } from "@figuredev/react-native-local-server"

type Props = {
    stateLabelServer: string
    initialPortServer: string
    ipAddressServer: Maybe<string>

    stateLabelClient: string
    initialPortClient: string
    initialHostClient: string

    stateLabelSearch?: string
    searchServices?: MessagingClientServiceSearchResult[]

    isRunning: boolean

    onClientStarted: (host: string, port: string) => void
    onClientStopped: () => void
    onClientRestarted?: () => void
    onServerStarted: (port: string) => void
    onServerStopped: () => void
    onServerRestarted?: () => void
    onSearchStarted?: () => void
    onSearchStopped?: () => void
    onSearchRestarted?: () => void
}

export const DoubleConfiguration = (props: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Server: </Text>
                <ServerConfiguration
                    style={styles.flex}
                    stateLabel={props.stateLabelServer}
                    isRunning={props.isRunning}
                    initialPort={props.initialPortServer}
                    ipAddress={props.ipAddressServer}
                    onStarted={props.onServerStarted}
                    onStopped={props.onServerStopped}
                    onRestart={props.onServerRestarted}
                />
            </View>
            <HorizontalLine opacity={0.5} />
            <View style={styles.row}>
                <Text style={styles.label}>Client: </Text>
                <ClientConfiguration
                    style={styles.flex}
                    stateLabel={props.stateLabelClient}
                    isRunning={props.isRunning}
                    initialPort={props.initialPortClient}
                    initialHost={props.initialHostClient}
                    onStarted={props.onClientStarted}
                    onStopped={props.onClientStopped}
                    onRestart={props.onClientRestarted}
                />
            </View>
            {props.stateLabelSearch && props.onSearchStarted && props.onSearchStopped ? (
                <>
                    <HorizontalLine opacity={0.5} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Search: </Text>
                        <SearchConfiguration
                            stateLabel={props.stateLabelSearch}
                            services={props.searchServices ?? []}
                            onStarted={props.onSearchStarted}
                            onStopped={props.onSearchStopped}
                            onRestart={props.onSearchRestarted}
                        />
                    </View>
                </>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    flex: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flex: 0,
    },
    label: {
        width: 90,
        fontSize: FontSize.Medium,
        padding: FontSize.Small,
        color: Colors.Black,
    },
})
