import type { messageDetailsType } from "@skylar/parsers-and-types";

import { getMessageUnbounded } from "../unbounded-core-api";
import { resolveAttachments } from "./attachment-fetch-utils";
import { getEmailBody, getEmailMetadata } from "./message-parse-utils";

export async function getAndParseMessages({
  messageIds,
  accessToken,
  emailId,
}: {
  messageIds: string[];
  accessToken: string;
  emailId: string;
}): Promise<messageDetailsType[]> {
  const rawMessages = await getMessageUnbounded({
    messageIds,
    accessToken,
    emailId,
  });

  const parsedMessages = rawMessages.map((msg) => {
    const emailMetadata = getEmailMetadata(msg.payload.headers);
    const emailData = getEmailBody({
      messageResponse: msg,
      emailProviderMessageId: msg.id,
      emailId,
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

  const parsedMessagesWithAttachments = await resolveAttachments({
    accessToken,
    emailId,
    messageDetailList: parsedMessages,
  });

  return parsedMessagesWithAttachments;
}
