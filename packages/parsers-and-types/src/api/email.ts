import type { Output } from "valibot";
import {
  array,
  boolean,
  enumType,
  minLength,
  object,
  optional,
  string,
  withDefault,
} from "valibot";

import { emailSchema } from "../core-parsers";

export const SUPPORTED_EMAIL_CATEGORIES = [
  "feed",
  "receipts",
  "important",
  "blocked",
] as const;

export const emailSenderSchema = object({
  name: optional(string()),
  emailAddress: emailSchema,
});

export const attachmentSchema = object({
  filename: string(),
  data: string(),
  contentType: string(),
  encoding: withDefault(
    enumType(["7bit", "8bit", "binary", "quoted-printable", "base64"]),
    "base64",
  ),
  inline: boolean(),
});
export const emailConfigSchema = object({
  to: array(emailSchema),
  from: emailSenderSchema,
  cc: optional(array(emailSchema)),
  bcc: optional(array(emailSchema)),
  subject: string(),
  text: optional(string()),
  html: optional(string()),
  replyConfig: optional(
    object({
      inReplyToRfcMessageId: string(),
      references: array(string()),
      rootSubject: string(),
      providerThreadId: string(),
    }),
  ),
  attachments: array(attachmentSchema),
});

export const EmailComposeSchema = object({
  from: emailSchema,
  to: array(emailSchema),
  cc: optional(array(emailSchema)),
  bcc: optional(array(emailSchema)),
  subject: string(),
  composeString: string([minLength(1, "You are about to send an empty email")]),
});

export type EmailSenderType = Output<typeof emailSenderSchema>;
export type EmailConfigType = Output<typeof emailConfigSchema>;
export type EmailComposeType = Output<typeof EmailComposeSchema>;
