import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "../../../../common/components/form/button"
import { Colors, FontSize } from "../../../../common/constants"
import { isCounterClientRunning } from "../../client/selectors"
import {
    createActionCounterAutoIncrementStarted,
    createActionCounterAutoIncrementStopped,
    createActionCounterCountDecreased,
    createActionCounterCountIncremented,
    createActionCounterCountResetRequested,
} from "../../data/actionts"
import { getCounterCount, isCounterAutoIncrementOn } from "../../data/selectors"

export const CounterView = () => {
    const dispatch = useDispatch()
    const clientIsRunning = useSelector(isCounterClientRunning)
    const autoIncrementOn = useSelector(isCounterAutoIncrementOn)
    const autoAction = autoIncrementOn
        ? createActionCounterAutoIncrementStopped()
        : createActionCounterAutoIncrementStarted()
    const count = useSelector(getCounterCount)
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.stretch}>
                    <Button
                        label={"-"}
                        labelStyle={styles.changeButton}
                        disabled={clientIsRunning}
                        onPress={() => dispatch(createActionCounterCountDecreased())}
                    />
                </View>
                <Text style={styles.label}>{count}</Text>
                <View style={styles.stretch}>
                    <Button
                        label={"+"}
                        labelStyle={styles.changeButton}
                        disabled={clientIsRunning}
                        onPress={() => dispatch(createActionCounterCountIncremented())}
                    />
                </View>
            </View>
            <Button
                label={"RESET"}
                labelStyle={styles.resetButton}
                onPress={() => dispatch(createActionCounterCountResetRequested())}
            />
            <Button
                label={autoIncrementOn ? "STOP" : "START"}
                labelStyle={styles.resetButton}
                disabled={clientIsRunning}
                onPress={() => dispatch(autoAction)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    stretch: {
        alignItems: "center",
        width: 100,
    },
    label: {
        fontSize: 104,
        color: Colors.Black,
        width: 180,
        textAlign: "center",
    },
    changeButton: {
        fontSize: 60,
    },
    resetButton: {
        fontSize: FontSize.Big,
    },
})
