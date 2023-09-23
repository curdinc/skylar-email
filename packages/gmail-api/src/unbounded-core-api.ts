import { batchGetMessage, getMessageList } from "./core-api";

export function splitToNChunks<T>(array: T[], n: number) {
  const result = [];
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
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
  const messageIdChunks = splitToNChunks(messageIds, 100);
  // iterate over slices of 100
  const messageIdBatchPromises = messageIdChunks.map((chunk) =>
    batchGetMessage({
      accessToken,
      emailId,
      messageIds: chunk,
    }),
  );

  const messageDataBatches = await Promise.all(messageIdBatchPromises);
  return messageDataBatches.flat();
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
