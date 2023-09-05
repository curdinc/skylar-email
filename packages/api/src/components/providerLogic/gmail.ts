import { TRPCError } from "@trpc/server";

import { gmailWatchResponseSchema, parse } from "@skylar/schema";

export async function getAccessToken({
  clientId,
  clientSecret,
  fromRefresh,
  payload,
}: {
  clientId: string;
  clientSecret: string;
  fromRefresh: boolean;
  payload: string;
}) {
  const grantType = fromRefresh ? "refresh_token" : "authorization_code";
  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: "postmessage",
    grant_type: grantType,
    code: payload,
  });

  const res = await fetch(
    "https://oauth2.googleapis.com/token?" + data.toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to subscribe to gmail account ${emailId}`,
    });
  }
  return res;
}

export async function watchGmailInbox(emailId: string, accessToken: string) {
  const data = {
    labelIds: ["INBOX"],
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

// export async function getAndParseGmailEmails(
//   emailId: string,
//   startHistoryId: string,
//   accessToken: string,
// ) {
//   const data2 = new URLSearchParams({
//     "startHistoryId": startHistoryId,
//     "historyTypes": "messageAdded messageDeleted"
//     // historyTypes: ["messageAdded", "messageDeleted"]
//   });

//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${accessToken}`,
//   });

//   const res 1= await fetch(
//     ` https://gmail.googleapis.com/gmail/v1/users/${emailId}/history`,
//     {
//       method: "GET",
//       headers: headers,
//       body: JSON.stringify(data1),
//     },
//   );
//   if (!res1.ok) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to get message-id(${messageId}) for ${emailId}.`,
//       cause: await res.text(),
//     });
//   }

//   const data = {
//     format: "full",
//   };

//   const res = await fetch(
//     `https://gmail.googleapis.com/gmail/v1/users/${emailId}/messages/${messageId}`,
//     {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(data),
//     },
//   );
//   if (!res.ok) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to get message-id(${messageId}) for ${emailId}.`,
//       cause: await res.text(),
//     });
//   }

//   const email = await res.json();
//   // parse it here
// }
