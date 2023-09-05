import type { Output } from "valibot";
import { boolean, number, object, string } from "valibot";

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
