import React from "react"
import { useDispatch } from "react-redux"

import { LoggerView } from "../../../../common/components/loggerView/loggerView"
import { createActionCounterLogClearRequested } from "../../data/actionts"

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
