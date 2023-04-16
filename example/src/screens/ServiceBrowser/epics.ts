import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import {
    createActionServiceBrowserErrored,
    createActionServiceBrowserServiceFound,
    createActionServiceBrowserServiceLost,
    createActionServiceBrowserStarted,
    createActionServiceBrowserStopped,
    SERVICE_BROWSER_START_REQUESTED,
    SERVICE_BROWSER_STOP_REQUESTED,
} from "./actions"
import { catchError, filter, map, mapTo, switchMap } from "rxjs/operators"
import { defer } from "rxjs"
import { BareServiceBrowser } from "./network"
import {
    ServiceBrowser,
    ServiceBrowserConfiguration,
    ServiceBrowserServiceFoundNativeEvent,
    ServiceBrowserServiceLostNativeEvent,
    ServiceBrowserStartedNativeEvent,
    ServiceBrowserStoppedNativeEvent,
} from "@figuredev/react-native-local-server"
import { fromEventFixed } from "../../common/utils"

const serviceBrowserStartRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(SERVICE_BROWSER_START_REQUESTED),
        switchMap((action: StateAction) => {
            const group = action.payload.group
            const config: ServiceBrowserConfiguration = {
                type: group,
            }
            return defer(() => BareServiceBrowser.start(config)).pipe(
                mapTo(createActionServiceBrowserStarted()),
                catchError((err) => [createActionServiceBrowserErrored(err)])
            )
        })
    )

const serviceBrowserReadyEpic: Epic = () =>
    fromEventFixed(ServiceBrowser.EventEmitter, ServiceBrowser.EventName.Started).pipe(
        filter((event: ServiceBrowserStartedNativeEvent) => event.browserId === BareServiceBrowser.getId()),
        map(() => createActionServiceBrowserStarted())
    )

const serviceBrowserStopRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(SERVICE_BROWSER_STOP_REQUESTED),
        switchMap(() => {
            return defer(() => BareServiceBrowser.stop()).pipe(
                switchMap(() => []),
                catchError((err) => [createActionServiceBrowserErrored(err)])
            )
        })
    )

const serviceBrowserStoppedEpic: Epic = () =>
    fromEventFixed(ServiceBrowser.EventEmitter, ServiceBrowser.EventName.Stopped).pipe(
        filter((event: ServiceBrowserStoppedNativeEvent) => event.browserId === BareServiceBrowser.getId()),
        mapTo(createActionServiceBrowserStopped())
    )

const serviceBrowserServiceFoundEpic: Epic = () =>
    fromEventFixed(ServiceBrowser.EventEmitter, ServiceBrowser.EventName.ServiceFound).pipe(
        filter((event: ServiceBrowserServiceFoundNativeEvent) => event.browserId === BareServiceBrowser.getId()),
        map((event: ServiceBrowserServiceFoundNativeEvent) => createActionServiceBrowserServiceFound(event.name))
    )

const serviceBrowserServiceLostEpic: Epic = () =>
    fromEventFixed(ServiceBrowser.EventEmitter, ServiceBrowser.EventName.ServiceLost).pipe(
        filter((event: ServiceBrowserServiceLostNativeEvent) => event.browserId === BareServiceBrowser.getId()),
        map((event: ServiceBrowserServiceLostNativeEvent) => createActionServiceBrowserServiceLost(event.name))
    )

export default [
    serviceBrowserStartRequestedEpic,
    serviceBrowserReadyEpic,
    serviceBrowserStopRequestedEpic,
    serviceBrowserStoppedEpic,
    serviceBrowserServiceFoundEpic,
    serviceBrowserServiceLostEpic,
]
