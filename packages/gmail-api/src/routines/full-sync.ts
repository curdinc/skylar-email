import type { SyncResponseType } from "@skylar/parsers-and-types";

import { getMessageListUnbounded } from "../unbounded-core-api";
import { getAndParseMessages } from "../utils/get-and-parse-messages";

export async function fullSync({
  accessToken,
  emailId,
  onError,
}: {
  accessToken: string;
  emailId: string;
  onError?: (error: Error) => void;
}): Promise<SyncResponseType> {
  // get all messages
  const messages = await getMessageListUnbounded({
    accessToken,
    emailId,
  });

  if (messages.length === 0) {
    throw new Error("No messages found", {
      cause: "full-sync",
    });
  }

  const messageIds = messages.map((m) => m.id);

  const newMessages = await getAndParseMessages({
    accessToken: accessToken,
    emailId,
    messageIds,
    onError,
  });

  const lastCheckedHistoryId = newMessages[0]?.historyId;

  if (!lastCheckedHistoryId) {
    throw new Error(`Error in lastCheckedHistoryId: undefined.`, {
      cause: "full-sync",
    });
  }

  return {
    newMessages,
    lastCheckedHistoryId,
  };
}
