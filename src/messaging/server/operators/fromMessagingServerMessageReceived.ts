import { Observable } from "rxjs"
import { map, share } from "rxjs/operators"

import { LoggerVerbosity, LoggerWrapper } from "../../../utils/logger"
import { log } from "../../../utils/operators/log"
import { getMessageId } from "../../functions/getMessageId"
import { parseServerMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { Message } from "../../types"

import { fromMessagingServerDataReceived } from "./fromMessagingServerDataReceived"


export const fromMessagingServerMessageReceived = <Body>(
    serverId: string,
    logger: LoggerWrapper,
): Observable<Message<Body>> =>
    fromMessagingServerDataReceived(serverId, logger).pipe(
        ofDataTypeMessage,
        map(parseServerMessage),
        deduplicateBy(getMessageId),
        log(LoggerVerbosity.High, logger, `MessagingServer [${serverId}] - received message`),
        share(),
    )
