// GENERAL
export * from "./src/helper";

// FEATURE SPECIFIC
export * from "./src/api/email";
export * from "./src/api/invite-code";
export * from "./src/api/mailing-list";
export * from "./src/api/onboarding";
export * from "./src/auth";

export * from "./src/api/email-provider/gmail-provider";
export {
  GmailPushNotificationDataObjectSchema,
  GmailPushNotificationSchema,
  getAttachmentResponseSchema,
  gmailProviderIDTokenSchema,
  gmailWatchResponseSchema,
  historyObjectSchema,
  labelInfoSchema,
  labelListSchema,
  messageListResponseSchema,
  messageResponseSchema,
  modifyMessageResponseSchema,
  trashMessageResponseSchema,
  type GmailPushNotificationType,
  type HistoryObjectType,
  type LabelConfigType,
  type MessagePartType,
  type MessageResponseType,
  type ModifiedLabelType,
  type SyncResponseType,
  type emailBodyParseResultType,
  type emailMetadataParseResultType,
  type messageDetailsType,
} from "./src/api/email-provider/gmail-provider";
export {
  SUPPORTED_EMAIL_PROVIDER_LIST,
  oauthOnboardingSchema,
  type Oauth2InitialTokenResponse,
  type Oauth2TokenFromRefreshTokenResponse,
  type SupportedEmailProviderType,
  type oauthOnboardingType,
} from "./src/api/email-provider/oauth";

// ENV ITEMS
export { BackendEnvSchema } from "./src/backend/env";
export type { BackendEnvType } from "./src/backend/env";
export { createEnv } from "./src/create-env";
export {
  ClientEnvSchemaObject,
  ServerEnvSchemaObject,
  SharedEnvSchemaObject,
} from "./src/nextjs/env";

// CONSTANTS
export * from "./src/constants/email-providers";

// CLIENT DB TABLES
export * from "./src/client-db-schema/provider";
