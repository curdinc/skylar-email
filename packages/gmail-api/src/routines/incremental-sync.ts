import type { SyncResponseType } from "@skylar/parsers-and-types";

import { GMAIL_MAX_FETCH_PER_SECOND } from "../constants";
import { getMessageList } from "../core-api";
import { getAndParseMessages } from "../utils/get-and-parse-messages";

export async function incrementalSync({
  accessToken,
  emailId,
  pageToken,
  onError,
  numberOfMessagesToFetch,
}: {
  accessToken: string;
  emailId: string;
  pageToken?: string;
  onError?: (error: Error) => void;
  numberOfMessagesToFetch: number;
}): Promise<SyncResponseType> {
  // get all messages
  const { messages, nextPageToken } = await getMessageList({
    accessToken,
    emailId,
    pageToken: pageToken ?? "",
    maxResults: numberOfMessagesToFetch,
  });

  if (messages.length === 0) {
    throw new Error("No messages found", {
      cause: "incremental-sync",
    });
  }

  const messageIds = messages.map((m) => m.id);

  const newMessages = await getAndParseMessages({
    accessToken: accessToken,
    emailId,
    messageIds,
    onError,
    fetchMessageChunkSize: GMAIL_MAX_FETCH_PER_SECOND,
  });

  const lastCheckedHistoryId = newMessages[0]?.historyId;

  if (!lastCheckedHistoryId) {
    throw new Error(`Error in lastCheckedHistoryId: undefined.`, {
      cause: "incremental-sync",
    });
  }

  return {
    newMessages,
    lastCheckedHistoryId,
    nextPageToken,
  };
}
