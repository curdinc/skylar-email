import type {
  Oauth2InitialTokenResponse,
  Oauth2TokenFromRefreshTokenResponse,
} from "@skylar/parsers-and-types";
import {
  formatValidatorError,
  getAttachmentResponseSchema,
  gmailWatchResponseSchema,
  historyObjectSchema,
  messageListResponseSchema,
  messageResponseSchema,
  modifyMessageResponseSchema,
  parse,
  trashMessageResponseSchema,
} from "@skylar/parsers-and-types";

import {
  GMAIL_BATCH_SEPARATOR_PREFIX,
  GMAIL_MAX_BATCH_REQUEST_SIZE,
  GMAIL_MAX_HISTORY_LIST_REQUEST_SIZE,
  GMAIL_MAX_MESSAGE_LIST_REQUEST_SIZE,
} from "./constants";
import { MultipartMixedService } from "./utils/multipart-parser";
import { sendBatchRequest } from "./utils/send-batch-request";

export async function getAccessToken<
  T extends "refresh_token" | "authorization_code",
>({
  clientId,
  clientSecret,
  grantType,
  ...payload
}: {
  clientId: string;
  clientSecret: string;
  grantType: T;
} & ({ refreshToken: string } | { authorizationCode: string })): Promise<
  T extends "refresh_token"
    ? Oauth2TokenFromRefreshTokenResponse
    : Oauth2InitialTokenResponse
> {
  const url = new URL("https://oauth2.googleapis.com/token");

  url.search = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: "postmessage",
    grant_type: grantType,
    ...("authorizationCode" in payload
      ? { code: payload.authorizationCode }
      : {
          refresh_token: payload.refreshToken,
        }),
  }).toString();

  // @ https://cloud.google.com/apigee/docs/api-platform/security/oauth/access-tokens#encoding
  const authHeader =
    "Basic " +
    Buffer.from(`${clientId}:${clientSecret}`, "binary").toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authHeader,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get access token. cause: ${await res.text()}`);
  }
  return (await res.json()) as T extends "refresh_token"
    ? Oauth2TokenFromRefreshTokenResponse
    : Oauth2InitialTokenResponse;
}

export async function watchGmailInbox(emailId: string, accessToken: string) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/watch`,
  );

  const data = {
    labelIds: ["UNREAD"],
    labelFilterBehavior: "include",
    topicName: "projects/skylar-email-398003/topics/incomingGmailEmails",
  };

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to subscribe to gmail account ${emailId}. cause: ${await res.text()}`,
    );
  }

  const watchResponse = parse(gmailWatchResponseSchema, await res.json());

  return watchResponse.historyId;
}

export async function getHistoryList({
  emailId,
  startHistoryId,
  accessToken,
  pageToken,
  maxResults = GMAIL_MAX_HISTORY_LIST_REQUEST_SIZE,
}: {
  emailId: string;
  startHistoryId: string;
  accessToken: string;
  pageToken?: string;
  maxResults?: number;
}) {
  if (maxResults > GMAIL_MAX_HISTORY_LIST_REQUEST_SIZE) {
    throw new Error(
      `Cannot show more than ${GMAIL_MAX_HISTORY_LIST_REQUEST_SIZE} messages.`,
    );
  }

  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/history`,
  );

  url.search = new URLSearchParams(
    pageToken && pageToken !== ""
      ? {
          startHistoryId,
          maxResults: maxResults.toString(),
          pageToken,
        }
      : {
          startHistoryId,
          maxResults: maxResults.toString(),
        },
  ).toString();

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const parsedResponse = parse(historyObjectSchema, await res.json());
  return parsedResponse;
}

export async function getMessage({
  emailId,
  messageId,
  accessToken,
}: {
  emailId: string;
  messageId: string;
  accessToken: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}`,
  );

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }
  const data = parse(messageResponseSchema, await res.json());
  return data;
}

export async function getMessageList({
  emailId,
  accessToken,
  pageToken,
  maxResults = GMAIL_MAX_MESSAGE_LIST_REQUEST_SIZE,
}: {
  emailId: string;
  accessToken: string;
  pageToken?: string;
  maxResults?: number;
}) {
  if (maxResults > GMAIL_MAX_MESSAGE_LIST_REQUEST_SIZE) {
    throw new Error(
      `Cannot show more than ${GMAIL_MAX_MESSAGE_LIST_REQUEST_SIZE} messages.`,
    );
  }

  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages`,
  );

  url.search = new URLSearchParams(
    pageToken && pageToken !== ""
      ? {
          maxResults: maxResults.toString(),
          pageToken,
        }
      : {
          maxResults: maxResults.toString(),
        },
  ).toString();

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const parsedData = parse(messageListResponseSchema, await res.json());
  return parsedData;
}

export async function getAttachment({
  emailId,
  messageId,
  attachmentId,
  accessToken,
}: {
  emailId: string;
  messageId: string;
  attachmentId: string;
  accessToken: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}/attachments/${attachmentId}`,
  );

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get attachmentId "${attachmentId}" with messageId "${messageId}" for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const parsedData = parse(getAttachmentResponseSchema, await res.json());
  return parsedData;
}

export async function trashMessage({
  messageId,
  accessToken,
  emailId,
}: {
  messageId: string;
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}/trash`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const response = parse(modifyMessageResponseSchema, await res.json());
  return response;
}

export async function untrashMessage({
  messageId,
  accessToken,
  emailId,
}: {
  messageId: string;
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}/untrash`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const response = parse(modifyMessageResponseSchema, await res.json());
  return response;
}

export async function trashThread({
  threadId,
  accessToken,
  emailId,
}: {
  threadId: string;
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/threads/${threadId}/trash`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  return (await res.json()) as { id: string; messages: string[] };
}

export async function untrashThread({
  threadId,
  accessToken,
  emailId,
}: {
  threadId: string;
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/threads/${threadId}/untrash`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }
  return (await res.json()) as { id: string; messages: string[] };
}

export async function modifyLabels({
  messageId,
  accessToken,
  emailId,
  addLabels,
  deleteLabels,
}: {
  messageId: string;
  accessToken: string;
  emailId: string;
  addLabels: string[];
  deleteLabels: string[];
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}/modify`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      addLabelIds: addLabels,
      removeLabelIds: deleteLabels,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const response = parse(modifyMessageResponseSchema, await res.json());
  return response;
}

export async function sendMail({
  accessToken,
  emailId,
  rfc822Base64EncodedMessageData,
}: {
  accessToken: string;
  emailId: string;
  rfc822Base64EncodedMessageData: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/send`,
  );

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      raw: rfc822Base64EncodedMessageData,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to send message for ${emailId}. cause: ${await res.text()}`,
    );
  }

  const response = parse(modifyMessageResponseSchema, await res.json());
  return response;
}

export async function listLabels({
  accessToken,
  emailId,
}: {
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/labels`,
  );

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    headers,
    method: "GET",
  });

  const data = (await res.json()) as { labels: unknown };

  return data.labels as {
    id: string;
    name: string;
    type: "system" | "user";
    messageListVisibility?: "hide" | "show";
  }[];
}

export async function batchCreateLabels({
  accessToken,
  emailId,
  labels,
}: {
  accessToken: string;
  emailId: string;
  labels: { name: string }[];
}) {
  if (labels.length > GMAIL_MAX_BATCH_REQUEST_SIZE) {
    throw new Error(
      `Cannot batch more than ${GMAIL_MAX_BATCH_REQUEST_SIZE} requests.`,
    );
  }
  const reqs = labels.map((label) => {
    return {
      contentType: "application/json",
      type: "POST" as const,
      url: `/gmail/v1/users/${emailId}/labels`,
      body: label,
    };
  });

  const res = await sendBatchRequest({
    accessToken,
    emailId,
    reqs,
  });

  if (!res.ok) {
    throw new Error(`Failed to get messages. cause: ${await res.text()}`);
  }

  const contentData = await MultipartMixedService.parseAsync(res);
  const messageData = contentData.map((data): { id: string; name: string } => {
    return data.json();
  });

  return messageData;
}

export async function batchGetMessages({
  messageIds,
  accessToken,
  emailId,
}: {
  messageIds: string[];
  accessToken: string;
  emailId: string;
}) {
  if (messageIds.length > GMAIL_MAX_BATCH_REQUEST_SIZE) {
    throw new Error(
      `Cannot batch more than ${GMAIL_MAX_BATCH_REQUEST_SIZE} requests.`,
    );
  }

  const url = new URL("https://gmail.googleapis.com/batch/gmail/v1");
  const boundary = GMAIL_BATCH_SEPARATOR_PREFIX + Date.now();
  const headers = new Headers({
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    Authorization: `Bearer ${accessToken}`,
  });

  const batchRequestBody =
    messageIds
      .map((messageId, index) => {
        const individualRequest =
          `--${boundary}\r\n` +
          `Content-Type: application/http\r\n` +
          `Content-ID: <${index + 1}>\r\n\r\n` +
          `GET /gmail/v1/users/${emailId}/messages/${messageId}?format=FULL\r\n`;
        return individualRequest;
      })
      .join("") + `--${boundary}--`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: batchRequestBody,
  });

  if (!res.ok) {
    throw new Error(`Failed to get messages. cause: ${await res.text()}`);
  }

  const contentData = await MultipartMixedService.parseAsync(res);
  const messageData = contentData.map((data) => {
    try {
      return parse(messageResponseSchema, data.json());
    } catch (e) {
      console.log("data", data.json());
      console.log(JSON.stringify(formatValidatorError(e), null, 2));
      throw e;
    }
  });

  return messageData;
}

export async function batchTrashThreads({
  threadIds,
  accessToken,
  emailId,
}: {
  threadIds: string[];
  accessToken: string;
  emailId: string;
}) {
  const reqs = threadIds.map((threadId) => {
    return {
      contentType: "application/http",
      type: "POST" as const,
      url: `/gmail/v1/users/${emailId}/threads/${threadId}/trash`,
    };
  });

  const res = await sendBatchRequest({
    accessToken,
    emailId,
    reqs,
  });

  if (!res.ok) {
    throw new Error(`Failed to get messages. cause: ${await res.text()}`);
  }

  const contentData = await MultipartMixedService.parseAsync(res);
  const messageData = contentData.map((data) => {
    try {
      return parse(trashMessageResponseSchema, data.json());
    } catch (e) {
      console.log("data", data.json());
      console.log(JSON.stringify(formatValidatorError(e), null, 2));
      throw e;
    }
  });

  return messageData;
}

export async function batchUntrashThreads({
  threadIds,
  accessToken,
  emailId,
}: {
  threadIds: string[];
  accessToken: string;
  emailId: string;
}) {
  const reqs = threadIds.map((threadId) => {
    return {
      contentType: "application/http",
      type: "POST" as const,
      url: `/gmail/v1/users/${emailId}/threads/${threadId}/untrash`,
    };
  });

  const res = await sendBatchRequest({
    accessToken,
    emailId,
    reqs,
  });

  if (!res.ok) {
    throw new Error(`Failed to get messages. cause: ${await res.text()}`);
  }

  const contentData = await MultipartMixedService.parseAsync(res);
  const messageData = contentData.map((data) => {
    try {
      return parse(trashMessageResponseSchema, data.json());
    } catch (e) {
      console.log("data", data.json());
      console.log(JSON.stringify(formatValidatorError(e), null, 2));
      throw e;
    }
  });

  return messageData;
}

export async function batchModifyLabels({
  accessToken,
  emailId,
  threadIds,
  addLabels,
  deleteLabels,
}: {
  threadIds: string[];
  accessToken: string;
  emailId: string;
  addLabels: string[];
  deleteLabels: string[];
}) {
  const reqs = threadIds.map((threadId) => {
    return {
      contentType: "application/json",
      type: "POST" as const,
      url: `/gmail/v1/users/${emailId}/threads/${threadId}/modify`,
      body: {
        addLabelIds: addLabels,
        removeLabelIds: deleteLabels,
      },
    };
  });

  const res = await sendBatchRequest({
    accessToken,
    emailId,
    reqs,
  });

  if (!res.ok) {
    throw new Error(`Failed to get messages. cause: ${await res.text()}`);
  }

  const contentData = await MultipartMixedService.parseAsync(res);
  const messageData = contentData.map((data) => {
    try {
      return parse(trashMessageResponseSchema, data.json());
    } catch (e) {
      console.log("data", data.json());
      console.log(JSON.stringify(formatValidatorError(e), null, 2));
      throw e;
    }
  });

  return messageData;
}
