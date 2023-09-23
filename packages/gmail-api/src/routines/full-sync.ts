import type { Logger } from "@skylar/logger";

import { getMessageListUnbounded } from "../unbounded-core-api";
import { getAndParseMessagesBatch } from "../utils/get-and-parse-messages-batch";

export async function fullSync({
  accessToken,
  emailId,
  logger,
}: {
  accessToken: string;
  emailId: string;
  logger: Logger;
}) {
  // get all messages
  const messages = await getMessageListUnbounded({
    accessToken,
    emailId,
  });
  const messageIds = messages.map((m) => m.id);
  const threadIds = messages.map((m) => m.threadId);

  const emailDataMerged = await getAndParseMessagesBatch({
    accessToken: accessToken,
    emailId,
    messageIds,
    threadIds,
    logger,
  });

  return emailDataMerged;
}
