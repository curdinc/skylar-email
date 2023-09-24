import type { Logger } from "@skylar/logger";
import type { SyncResponseType } from "@skylar/parsers-and-types";

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
}): Promise<SyncResponseType> {
  try {
    // get all messages
    const messages = await getMessageListUnbounded({
      accessToken,
      emailId,
    });
    const messageIds = messages.map((m) => m.id);

    const newMessages = await getAndParseMessages({
      accessToken: accessToken,
      emailId,
      messageIds,
      logger,
    });
    return {
      newMessages,
    };
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Error in partial sync.", {
        e,
        cause: "known",
        emailId,
      });
    } else {
      logger.error("Error in partial sync.", {
        cause: "unknown",
        emailId,
      });
    }
    return {
      newMessages: [],
    };
  }
}
