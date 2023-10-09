// GENERAL
export {
  formatValidatorError,
  parse,
  testSchema,
  validatorTrpcWrapper,
} from "./src/helper";

// FEATURE SPECIFIC
export * from "./src/api/invite-code";
export * from "./src/api/mailing-list";
export * from "./src/api/onboarding";
export * from "./src/auth";

export {
  SUPPORTED_EMAIL_CATEGORIES,
  emailConfigSchema,
  type EmailConfigType,
  type emailSenderType,
} from "./src/api/email";
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
export type { EmailProviderDetailType } from "./src/api/provider";
export { BackendEnvSchema } from "./src/backend/env";
export type { BackendEnvType } from "./src/backend/env";
export { createEnv } from "./src/create-env";
export {
  ClientEnvSchemaObject,
  ServerEnvSchemaObject,
  SharedEnvSchemaObject,
} from "./src/nextjs/env";
