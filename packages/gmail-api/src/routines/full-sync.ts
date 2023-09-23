import type { Logger } from "@skylar/logger";

import { getMessageListUnbounded } from "../unbounded-core-api";
import { getAndParseMessages } from "../utils/get-and-parse-messages";

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

  const emailDataMerged = await getAndParseMessages({
    accessToken: accessToken,
    emailId,
    messageIds,
    logger,
  });
  return emailDataMerged;
}
