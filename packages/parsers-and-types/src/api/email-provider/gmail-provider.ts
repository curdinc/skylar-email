import type { BaseSchema, Output } from "valibot";
import {
  array,
  boolean,
  date,
  email,
  integer,
  merge,
  number,
  object,
  optional,
  recursive,
  string,
} from "valibot";

// identity token schema - decoded JWT from gmail
export const gmailProviderIDTokenSchema = object({
  iss: string(),
  azp: string(),
  aud: string(),
  sub: string(),
  email: string(),
  email_verified: boolean(),
  at_hash: string(),
  name: string(),
  picture: string(),
  given_name: string(),
  family_name: string(),
  locale: string(),
  iat: number(),
  exp: number(),
});

export const GmailPushNotificationSchema = object({
  message: object({
    data: string(),
    messageId: string(),
    message_id: string(),
    publishTime: string(),
    publish_time: string(),
  }),
  subscription: string(),
});

export const gmailWatchResponseSchema = object({
  historyId: string(),
  expiration: string(),
});

export type GmailPushNotificationType = Output<
  typeof GmailPushNotificationSchema
>;

export const GmailPushNotificationDataObjectSchema = object({
  emailAddress: string(),
  historyId: number(),
});

// api message schemas
const headerSchema = object({
  name: string(),
  value: string(),
});

const messagePartBodySchema = object({
  attachmentId: optional(string()),
  size: number([integer()]),
  data: optional(string()),
});

const baseMessagePartSchema = object({
  partId: string(),
  mimeType: string(),
  filename: string(),
  headers: array(headerSchema),
  body: messagePartBodySchema,
});

type InputMessagePartType = Output<typeof baseMessagePartSchema> & {
  parts?: InputMessagePartType[];
};

const messagePartSchema: BaseSchema<InputMessagePartType> = merge([
  baseMessagePartSchema,
  object({ parts: recursive(() => optional(array(messagePartSchema))) }),
]);

const messageMetadataSchema = object({
  id: string(),
  threadId: string(),
  labelIds: array(string()),
});

const historyItemSchema = object({
  id: string(),
  messages: array(
    object({
      threadId: string(),
      id: string(),
    }),
  ),
  messagesAdded: optional(array(object({ message: messageMetadataSchema }))),
  messagesDeleted: optional(array(object({ message: messageMetadataSchema }))),
  labelsAdded: optional(array(object({ message: messageMetadataSchema }))),
  labelsRemoved: optional(array(object({ message: messageMetadataSchema }))),
});

export const historyObjectSchema = object({
  history: array(historyItemSchema),
  historyId: string(),
  nextPageToken: optional(string()),
});

export const messageResponseSchema = object({
  payload: messagePartSchema,
  historyId: string(),
  threadId: string(),
  snippet: string(),
  id: string(),
  labelIds: array(string()),
});

export const messageListResponseSchema = object({
  messages: array(
    object({
      threadId: string(),
      id: string(),
    }),
  ),
  nextPageToken: optional(string()),
  resultSizeEstimate: number(),
});

const emailSenderSchema = object({
  name: optional(string()),
  email: string(),
});
const modifiedLabelSchema = object({
  mid: string(),
  newLabels: array(string()),
});

const emailBodyParseResultSchema = object({
  html: array(string()),
  plain: array(string()),
  attachments: array(
    object({
      partId: string(),
      mimeType: string(),
      filename: string(),
      body: object({
        attachmentId: string(),
        size: number([integer()]),
        data: optional(string()),
      }),
    }),
  ),
});

const emailMetadataParseResultSchema = object({
  from: emailSenderSchema,
  subject: string(),
  inReplyTo: emailSenderSchema,
  bcc: emailSenderSchema,
  cc: array(emailSenderSchema),
  createdAt: date(),
  deliveredTo: array(emailSenderSchema),
  replyTo: array(emailSenderSchema),
  rfc822MessageId: string(),
  to: array(emailSenderSchema),
});

const messageDetailsSchema = object({
  snippet: string(),
  historyId: string(),
  providerLabels: array(string()),
  emailMetadata: emailMetadataParseResultSchema,
  emailData: emailBodyParseResultSchema,
  emailProviderMessageId: string(),
  emailProviderThreadId: string(),
});

const syncResponseSchema = object({
  newMessages: array(messageDetailsSchema),
  messagesDeleted: optional(array(string())),
  labelsModified: optional(array(modifiedLabelSchema)),
  lastCheckedHistoryId: string(),
});

export const getAttachmentResponseSchema = object({
  size: number([integer()]),
  data: string(),
});

export type MessageResponseType = Output<typeof messageResponseSchema>;

export type HistoryObjectType = Output<typeof historyObjectSchema>;

export type MessageListResponseType = Output<typeof messageListResponseSchema>;

export type MessagePartType = Output<typeof messagePartSchema>;

export type emailMetadataParseResultType = Output<
  typeof emailMetadataParseResultSchema
>;

export type emailBodyParseResultType = Output<
  typeof emailBodyParseResultSchema
>;
export type messageDetailsType = Output<typeof messageDetailsSchema>;
export type ModifiedLabelType = Output<typeof modifiedLabelSchema>;
export type SyncResponseType = Output<typeof syncResponseSchema>;
export type emailSenderType = Output<typeof emailSenderSchema>;

export const GetGmailAccessTokenSchema = object({
  email: string([email()]),
});
