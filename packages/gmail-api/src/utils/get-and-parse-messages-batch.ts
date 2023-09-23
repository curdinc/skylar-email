import type { Logger } from "@skylar/logger";

import { getMessageUnbounded } from "../unbounded-core-api";
import { getEmailBody, getEmailMetadata } from "./message-parse-utils";

export async function getAndParseMessagesBatch({
  messageIds,
  threadIds,
  accessToken,
  emailId,
  logger,
}: {
  messageIds: string[];
  threadIds: string[];
  accessToken: string;
  emailId: string;
  logger: Logger;
}) {
  const rawMessages = await getMessageUnbounded({
    messageIds,
    accessToken,
    emailId,
  });

  const parsedMessages = rawMessages.map((msg, ind) => {
    const emailMetadata = getEmailMetadata(msg.payload.headers);
    const emailData = getEmailBody({
      payloads: [msg.payload],
      mid: msg.id,
      emailId,
      logger,
    });
    return {
      snippet: msg.snippet,
      historyId: msg.historyId,
      providerLabels: msg.labelIds,
      emailMetadata,
      emailData,
      emailProviderMessageId: messageIds[ind],
      emailProviderThreadId: threadIds[ind],
    };
  });

  return parsedMessages;
}
