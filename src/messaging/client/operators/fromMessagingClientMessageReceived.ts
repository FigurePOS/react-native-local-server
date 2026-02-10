import { Observable } from "rxjs"
import { map, share } from "rxjs/operators"

import { LoggerVerbosity, LoggerWrapper } from "../../../utils/logger"
import { log } from "../../../utils/operators/log"
import { getMessageId } from "../../functions/getMessageId"
import { parseClientMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { Message } from "../../types"

import { fromMessagingClientDataReceived } from "./"

export const fromMessagingClientMessageReceived = <Body>(
    clientId: string,
    logger: LoggerWrapper,
): Observable<Message<Body>> =>
    fromMessagingClientDataReceived(clientId, logger).pipe(
        ofDataTypeMessage,
        map(parseClientMessage),
        deduplicateBy(getMessageId),
        log(LoggerVerbosity.High, logger, `MessagingClient [${clientId}] - received message`),
        share(),
    )
