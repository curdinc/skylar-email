import type { SyncResponseType } from "@skylar/parsers-and-types";

import { getAndParseMessages } from "../utils/get-and-parse-messages";
import { getMessageChangesFromHistoryId } from "../utils/message-fetch-utils";

export async function partialSync({
  accessToken,
  emailId,
  startHistoryId,
}: {
  accessToken: string;
  emailId: string;
  startHistoryId: string;
}): Promise<SyncResponseType> {
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
      lastCheckedHistoryId: messageChanges.lastCheckedHistoryId,
    };
  }

  const newMessages = await getAndParseMessages({
    accessToken: accessToken,
    emailId,
    messageIds: messageChanges.messagesAdded,
  });

  return {
    newMessages,
    messagesDeleted: messageChanges.messagesDeleted,
    labelsModified: messageChanges.labelsModified,
    lastCheckedHistoryId: messageChanges.lastCheckedHistoryId,
  };
}
