import React from "react"
import { DoubleConfiguration } from "../../../common/components/configuration/DoubleConfiguration"

export const CounterConfiguration = () => {
    return (
        <DoubleConfiguration
            stateLabelServer={""}
            initialPortServer={""}
            stateLabelClient={""}
            initialPortClient={""}
            initialHostClient={""}
            isRunning={true}
            onClientStarted={() => {}}
            onClientStopped={() => {}}
            onServerStarted={() => {}}
            onServerStopped={() => {}}
        />
    )
}
