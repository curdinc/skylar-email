import type { messageDetailsType } from "@skylar/parsers-and-types";

import { GMAIL_MAX_BATCH_REQUEST_SIZE } from "../constants";
import { getMessageUnbounded } from "../unbounded-core-api";
import { getEmailBody, getEmailMetadata } from "./message-parse-utils";

export async function getAndParseMessages({
  messageIds,
  accessToken,
  emailId,
  onError,
  fetchMessageChunkSize = GMAIL_MAX_BATCH_REQUEST_SIZE,
}: {
  messageIds: string[];
  accessToken: string;
  emailId: string;
  onError?: (error: unknown) => void;
  fetchMessageChunkSize?: number;
}): Promise<messageDetailsType[]> {
  const rawMessages = await getMessageUnbounded({
    messageIds,
    accessToken,
    emailId,
    chunkSize: fetchMessageChunkSize,
    onError,
  });

  const parsedMessages = rawMessages.map((msg) => {
    const emailMetadata = getEmailMetadata(msg.payload.headers);
    const emailData = getEmailBody({
      messageResponse: msg,
      emailProviderMessageId: msg.id,
      emailId,
      onError,
    });
    return {
      snippet: msg.snippet,
      historyId: msg.historyId,
      providerLabels: msg.labelIds,
      emailMetadata,
      emailData,
      emailProviderMessageId: msg.id,
      emailProviderThreadId: msg.threadId,
    };
  });

  return parsedMessages;
}
