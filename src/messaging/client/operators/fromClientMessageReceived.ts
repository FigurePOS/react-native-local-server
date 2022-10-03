import { Observable } from "rxjs"
import { Message } from "../../types"
import { map, share } from "rxjs/operators"
import { fromClientDataReceived } from "./fromClientDataReceived"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { parseClientMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { getMessageId } from "../../functions/getMessageId"
import { log } from "../../../utils/operators/log"
import { LoggerWrapper } from "../../../utils/logger/loggerWrapper"
import { LoggerVerbosity } from "../../../utils/logger/types"

export const fromClientMessageReceived = <Body>(clientId: string, logger: LoggerWrapper): Observable<Message<Body>> =>
    fromClientDataReceived(clientId).pipe(
        ofDataTypeMessage,
        map(parseClientMessage),
        deduplicateBy(getMessageId),
        log(LoggerVerbosity.Medium, logger, `MessagingClient [${clientId}] - received message`),
        share()
    )
