import { ActionsObservable, Epic, ofType } from "redux-observable"
import { StateAction } from "../../types"
import { TCP_SERVER_START_REQUESTED } from "./actions"
import { switchMap } from "rxjs/operators"

const tcpServerStartRequestedEpic: Epic = (action$: ActionsObservable<StateAction>) =>
    action$.pipe(
        ofType(TCP_SERVER_START_REQUESTED),
        switchMap((action: StateAction) => {
            console.log("Kokot")
            return []
        })
    )

export default [tcpServerStartRequestedEpic]
