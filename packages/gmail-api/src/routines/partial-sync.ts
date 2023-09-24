import type { Logger } from "@skylar/logger";
import type { SyncResponseType } from "@skylar/parsers-and-types";

import { getAndParseMessages } from "../utils/get-and-parse-messages";
import { getMessageChangesFromHistoryId } from "../utils/message-fetch-utils";

export async function partialSync({
  accessToken,
  emailId,
  startHistoryId,
  logger,
}: {
  accessToken: string;
  emailId: string;
  startHistoryId: string;
  logger: Logger;
}): Promise<SyncResponseType> {
  try {
    // get all messages
    const messageChanges = await getMessageChangesFromHistoryId({
      accessToken,
      emailId,
      startHistoryId,
    });

    if (messageChanges.messagesAdded.length === 0) {
      return {
        newMessages: [],
        messagesDeleted: messageChanges.messagesDeleted,
        labelsModified: messageChanges.labelsModified,
      };
    }

    const newMessages = await getAndParseMessages({
      accessToken: accessToken,
      emailId,
      messageIds: messageChanges.messagesAdded,
      logger,
    });
    return {
      newMessages,
      messagesDeleted: messageChanges.messagesDeleted,
      labelsModified: messageChanges.labelsModified,
    };
  } catch (e) {
    if (e instanceof Error) {
      logger.error("Error in partial sync.", {
        e,
        cause: "known",
        emailId,
        startHistoryId,
      });
    } else {
      logger.error("Error in partial sync.", {
        cause: "unknown",
        emailId,
        startHistoryId,
      });
    }
    return {
      newMessages: [],
      messagesDeleted: [],
      labelsModified: [],
    };
  }
}
