import { Observable } from "rxjs"
import { Message } from "../../types"
import { map, share } from "rxjs/operators"
import { fromMessagingServerDataReceived } from "./fromMessagingServerDataReceived"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { parseServerMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { getMessageId } from "../../functions/getMessageId"
import { log } from "../../../utils/operators/log"
import { LoggerVerbosity, LoggerWrapper } from "../../../utils/logger"

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
