import { TRPCError } from "@trpc/server";

import type {
  Oauth2InitialTokenResponse,
  Oauth2TokenFromRefreshTokenResponse,
} from "@skylar/parsers-and-types";
import {
  gmailWatchResponseSchema,
  historyObjectSchema,
  messageListResponseSchema,
  messageResponseSchema,
  parse,
} from "@skylar/parsers-and-types";

import { MultipartMixedService } from "./multipart-parse";

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
  const urlData = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: "postmessage",
    grant_type: grantType,
    ...("authorizationCode" in payload
      ? { code: payload.authorizationCode }
      : {
          refresh_token: payload.refreshToken,
        }),
  };

  const data = new URLSearchParams(urlData);

  // @ https://cloud.google.com/apigee/docs/api-platform/security/oauth/access-tokens#encoding
  const authHeader =
    "Basic " +
    Buffer.from(`${clientId}:${clientSecret}`, "binary").toString("base64");

  const res = await fetch(
    "https://oauth2.googleapis.com/token?" + data.toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
    },
  );
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get access token. Error: ${await res.text()}`,
    });
  }
  return await res.json();
}

export async function watchGmailInbox(emailId: string, accessToken: string) {
  const data = {
    labelIds: ["UNREAD"],
    labelFilterBehavior: "include",
    topicName: "projects/skylar-email-398003/topics/incomingGmailEmails",
  };

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/watch`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to subscribe to gmail account ${emailId}`,
      cause: await res.text(),
    });
  }

  const watchResponse = parse(gmailWatchResponseSchema, await res.json());

  return watchResponse.historyId;
}

export async function getInboxHistory({
  emailId,
  startHistoryId,
  accessToken,
}: {
  emailId: string;
  startHistoryId: string;
  accessToken: string;
}) {
  const params = new URLSearchParams({
    startHistoryId: startHistoryId,
    historyTypes: "messageAdded",
  });

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/history?${params.toString()}`,
    {
      method: "GET",
      headers: headers,
    },
  );
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get history for ${emailId}.`,
      cause: await res.text(),
    });
  }

  const data = await res.json();
  const parsedResponse = parse(historyObjectSchema, data);
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
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}`,
    {
      method: "GET",
      headers: headers,
    },
  );
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get history for ${emailId}.`,
      cause: await res.text(),
    });
  }

  const data = parse(messageResponseSchema, await res.json());
  return data;
}

export async function getMessageList({
  emailId,
  accessToken,
  pageToken = undefined,
  maxResults = 500,
}: {
  emailId: string;
  accessToken: string;
  pageToken?: undefined | string;
  maxResults?: number;
}) {
  if (maxResults > 500) {
    throw new Error("Cannot show more than 500 messages.");
  }
  let url = `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages?maxResults=${maxResults}`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get history for ${emailId}.`,
      cause: await res.text(),
    });
  }

  const data = parse(messageListResponseSchema, await res.json());
  return data;
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
  const boundary = "yellow_lemonades_" + Date.now();
  const url = "https://gmail.googleapis.com/batch/gmail/v1";

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

  console.log("batchRequestBody", batchRequestBody);

  const headers = new Headers({
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    Authorization: `Bearer ${accessToken}`,
  });
  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: batchRequestBody,
  });
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get messages.`,
      cause: await res.text(),
    });
  }

  const contentData = await MultipartMixedService.parseAsync(res);

  const messageData = contentData.map((data) => {
    return parse(messageResponseSchema, data.json());
  });
  console.log("m", messageData);
}
