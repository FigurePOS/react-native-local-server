export const SERVICE_BROWSER_START_REQUESTED = "SERVICE_BROWSER_START_REQUESTED"
export const createActionServiceBrowserStartRequested = (group: string) => ({
    type: SERVICE_BROWSER_START_REQUESTED,
    payload: {
        group: group,
    },
})

export const SERVICE_BROWSER_STARTED = "SERVICE_BROWSER_STARTED"
export const createActionServiceBrowserStarted = () => ({
    type: SERVICE_BROWSER_STARTED,
})

export const SERVICE_BROWSER_STOP_REQUESTED = "SERVICE_BROWSER_STOP_REQUESTED"
export const createActionServiceBrowserStopRequested = () => ({
    type: SERVICE_BROWSER_STOP_REQUESTED,
})

export const SERVICE_BROWSER_STOPPED = "SERVICE_BROWSER_STOPPED"
export const createActionServiceBrowserStopped = () => ({
    type: SERVICE_BROWSER_STOPPED,
})

export const SERVICE_BROWSER_ERRORED = "SERVICE_BROWSER_ERRORED"
export const createActionServiceBrowserErrored = (error: string) => ({
    type: SERVICE_BROWSER_ERRORED,
    payload: {
        error: error,
    },
})

export const SERVICE_BROWSER_SERVICE_FOUND = "SERVICE_BROWSER_SERVICE_FOUND"
export const createActionServiceBrowserServiceFound = (service: string) => ({
    type: SERVICE_BROWSER_SERVICE_FOUND,
    payload: {
        service: service,
    },
})

export const SERVICE_BROWSER_SERVICE_LOST = "SERVICE_BROWSER_SERVICE_LOST"
export const createActionServiceBrowserServiceLost = (service: string) => ({
    type: SERVICE_BROWSER_SERVICE_LOST,
    payload: {
        service: service,
    },
})
