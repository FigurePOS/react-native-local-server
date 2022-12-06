import { Observable } from "rxjs"
import { Message } from "../../types"
import { map, share } from "rxjs/operators"
import { fromMessagingClientDataReceived } from "./"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { parseClientMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { getMessageId } from "../../functions/getMessageId"
import { log } from "../../../utils/operators/log"
import { LoggerVerbosity, LoggerWrapper } from "../../../utils/logger"

export const fromMessagingClientMessageReceived = <Body>(
    clientId: string,
    logger: LoggerWrapper
): Observable<Message<Body>> =>
    fromMessagingClientDataReceived(clientId).pipe(
        ofDataTypeMessage,
        map(parseClientMessage),
        deduplicateBy(getMessageId),
        log(LoggerVerbosity.High, logger, `MessagingClient [${clientId}] - received message`),
        share()
    )
