import { backOff } from "exponential-backoff";

import type { HistoryObjectType } from "@skylar/parsers-and-types";

import { GMAIL_MAX_BATCH_REQUEST_SIZE } from "./constants";
import {
  batchGetMessage,
  getAttachment,
  getHistoryList,
  getMessageList,
} from "./core-api";

export function splitToNChunks<T>(array: T[], n: number) {
  const maxIterations = Math.ceil(array.length / n);
  const result = [];
  for (let i = 0; i < maxIterations; ++i) {
    result.push(array.splice(0, n));
  }
  return result;
}

export async function getMessageUnbounded({
  messageIds,
  accessToken,
  emailId,
}: {
  messageIds: string[];
  accessToken: string;
  emailId: string;
}) {
  // create batches
  const messageIdChunks = splitToNChunks(
    messageIds,
    GMAIL_MAX_BATCH_REQUEST_SIZE,
  );
  // iterate over slices of 100
  const messageIdBatchPromises = messageIdChunks.map((chunk) =>
    backOff(
      () =>
        batchGetMessage({
          accessToken,
          emailId,
          messageIds: chunk,
        }),
      {
        startingDelay: 250,
        timeMultiple: 4,
        jitter: "full",
      },
    ),
  );

  const rawMessageDataBatches = await Promise.allSettled(
    messageIdBatchPromises,
  );
  const parseMessageDataBatches = rawMessageDataBatches.map((m) => {
    if (m.status === "fulfilled") {
      return m.value;
    }
    console.error(`Failed to retrieve message batch. Error: ${m.reason} `);
    return [];
  });
  return parseMessageDataBatches.flat();
}

export async function getMessageListUnbounded({
  emailId,
  accessToken,
  pageToken,
}: {
  emailId: string;
  accessToken: string;
  pageToken?: string;
}) {
  // this requires pageToken so cannot use promises
  let messageListResponses: { threadId: string; id: string }[] = [];
  let pageTokenIterable = pageToken;
  // let it sweep the entire list
  if (!pageToken) {
    pageTokenIterable = "";
  }

  while (pageTokenIterable !== undefined) {
    const messageListResponse = await getMessageList({
      accessToken,
      emailId,
      pageToken: pageTokenIterable,
    });
    messageListResponses = messageListResponses.concat(
      messageListResponse.messages,
    );
    pageTokenIterable = messageListResponse.nextPageToken;
  }
  return messageListResponses;
}

export async function getHistoryListUnbounded({
  emailId,
  accessToken,
  startHistoryId,
  pageToken,
}: {
  emailId: string;
  startHistoryId: string;
  accessToken: string;
  pageToken?: string;
}) {
  // this requires pageToken so cannot use promises
  let historyListResponses: HistoryObjectType[] = [];
  let pageTokenIterable = pageToken;
  // let it sweep the entire list
  if (!pageToken) {
    pageTokenIterable = "";
  }

  while (pageTokenIterable !== undefined) {
    const messageListResponse = await getHistoryList({
      accessToken,
      emailId,
      startHistoryId,
      pageToken: pageTokenIterable,
    });
    historyListResponses = historyListResponses.concat(messageListResponse);
    pageTokenIterable = messageListResponse.nextPageToken;
  }
  return historyListResponses;
}

// get more that one attachment per email
export async function getAttachmentUnbouned({
  emailId,
  messageId,
  attachmentIds,
  accessToken,
}: {
  emailId: string;
  messageId: string;
  attachmentIds: string[];
  accessToken: string;
}) {
  const attachmentBatch = attachmentIds.map(async (aid) => {
    return await getAttachment({
      accessToken,
      attachmentId: aid,
      emailId,
      messageId,
    });
  });

  const attachments = await Promise.allSettled(attachmentBatch);

  const parsedAttachments = attachments.map((m) => {
    if (m.status === "fulfilled") {
      return m.value;
    }
    console.error(`Failed to retrieve message batch. Error: ${m.reason} `);
    return [];
  });

  return parsedAttachments.flat();
}
