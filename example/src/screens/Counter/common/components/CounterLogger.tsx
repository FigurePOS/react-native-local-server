import React from "react"
import { createActionCounterLogClearRequested } from "../../data/actionts"
import { LoggerView } from "../../../../common/components/loggerView/loggerView"
import { useDispatch } from "react-redux"

export const CounterLogger = () => {
    const dispatch = useDispatch()
    // const log = useSelector(getCounterLogData)
    return (
        <LoggerView
            name={"Counter Logger"}
            data={[]}
            onClearPressed={() => dispatch(createActionCounterLogClearRequested())}
        />
    )
}
