// GENERAL
export {
  formatValidatorError,
  parse,
  testSchema,
  validatorTrpcWrapper,
} from "./src/helper";

// FEATURE SPECIFIC
export * from "./src/api/invite-code";
export * from "./src/api/onboarding";
export * from "./src/auth";
export type {
  QueryType,
  SupabaseUserType,
  SupportedAuthProvidersType,
  UserType,
} from "./src/auth";

export { SUPPORTED_EMAIL_CATEGORIES } from "./src/api/email";
export {
  GmailPushNotificationDataObjectSchema,
  GmailPushNotificationSchema,
  gmailProviderIDTokenSchema,
  gmailWatchResponseSchema,
  historyObjectSchema,
  messageListResponseSchema,
  messageResponseSchema,
  type GmailPushNotificationType,
  type MessagePartType,
  type historyObjectType,
} from "./src/api/email-provider/gmail-provider";
export {
  oauthOnboardingSchema,
  SUPPORTED_EMAIL_PROVIDERS as providerEnumList,
  type Oauth2InitialTokenResponse,
  type Oauth2TokenFromRefreshTokenResponse,
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
