import type { Output } from "valibot";
import {
  array,
  boolean,
  email,
  enumType,
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
  email: emailSchema,
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
  to: array(string([email()])),
  from: emailSenderSchema,
  cc: optional(array(string([email()]))),
  bcc: optional(array(string([email()]))),
  subject: string(),
  text: optional(string()),
  html: optional(string()),
  replyConfig: optional(
    object({
      inReplyToRfcMessageId: string(),
      references: array(string()),
      rootSubject: string(),
    }),
  ),
  attachments: array(attachmentSchema),
});

export type emailSenderType = Output<typeof emailSenderSchema>;
export type EmailConfigType = Output<typeof emailConfigSchema>;
