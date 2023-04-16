import React, { useCallback } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ServiceBrowserConfiguration } from "./components/ServiceBrowserConfiguration"
import { useDispatch, useSelector } from "react-redux"
import {
    getServiceBrowserGroup,
    getServiceBrowserServices,
    getServiceBrowserStateLabel,
    isServiceBrowserRunning,
} from "./selectors"
import { HorizontalLine } from "../../common/components/horizontalLine"
import { createActionServiceBrowserStartRequested, createActionServiceBrowserStopRequested } from "./actions"

export const ServiceBrowserScreen = () => {
    const dispatch = useDispatch()
    const group = useSelector(getServiceBrowserGroup)
    const isRunning = useSelector(isServiceBrowserRunning)
    const stateLabel = useSelector(getServiceBrowserStateLabel)
    const services = useSelector(getServiceBrowserServices)

    const onStarted = useCallback(
        (requestedGroup: string) => dispatch(createActionServiceBrowserStartRequested(requestedGroup)),
        [dispatch]
    )
    const onStopped = useCallback(() => dispatch(createActionServiceBrowserStopRequested()), [dispatch])
    return (
        <View style={styles.container}>
            <ServiceBrowserConfiguration
                groupName={group}
                isRunning={isRunning}
                onStarted={onStarted}
                onStopped={onStopped}
                stateLabel={stateLabel}
            />
            <HorizontalLine />
            <View style={styles.content}>
                {services.map((service: string) => (
                    <Text key={service} style={styles.service}>
                        {service}
                    </Text>
                ))}
                {services.length === 0 ? <Text>No services found</Text> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    service: {
        fontSize: 18,
        marginBottom: 10,
        color: "black",
    },
})
