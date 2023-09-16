import type { BaseSchema, Output } from "valibot";
import {
  array,
  boolean,
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
  message: object({
    id: string(),
    threadId: string(),
  }),
});

const historyItemSchema = object({
  messagesAdded: array(messageMetadataSchema),
});

export const historyObjectSchema = object({
  history: array(historyItemSchema),
  historyId: string(),
  nextPageToken: optional(string()),
});

export const messageResponseSchema = object({
  payload: messagePartSchema,
});

export type MessagePartType = Output<typeof messagePartSchema>;
