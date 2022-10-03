import { Observable } from "rxjs"
import { Message } from "../../types"
import { map, share } from "rxjs/operators"
import { fromServerDataReceived } from "./fromServerDataReceived"
import { ofDataTypeMessage } from "../../operators/ofDataType"
import { parseServerMessage } from "../../functions/parseMessage"
import { deduplicateBy } from "../../operators/deduplicateBy"
import { getMessageId } from "../../functions/getMessageId"
import { log } from "../../../utils/operators/log"
import { LoggerVerbosity, LoggerWrapper } from "../../../utils/logger/"

export const fromServerMessageReceived = <Body>(serverId: string, logger: LoggerWrapper): Observable<Message<Body>> =>
    fromServerDataReceived(serverId).pipe(
        ofDataTypeMessage,
        map(parseServerMessage),
        deduplicateBy(getMessageId),
        log(LoggerVerbosity.Medium, logger, `MessagingServer [${serverId}] - received message`),
        share()
    )
