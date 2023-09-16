export {
  GmailPushNotificationDataObjectSchema,
  GmailPushNotificationSchema,
  gmailProviderIDTokenSchema,
  gmailWatchResponseSchema,
  historyObjectSchema,
  messageResponseSchema,
  type GmailPushNotificationType,
  type MessagePartType,
} from "./src/api/email-provider/gmail-provider";

export { SUPPORTED_EMAIL_CATEGORIES } from "./src/api/email";
export {
  oauthOnboardingSchema,
  providerEnumList,
  type Oauth2InitialTokenResponse,
  type Oauth2TokenFromRefreshTokenResponse,
  type oauthOnboardingType,
} from "./src/api/email-provider/oauth";
export * from "./src/api/onboarding";
export * from "./src/auth";

export {
  formatValidatorError,
  parse,
  testSchema,
  validatorTrpcWrapper,
} from "./src/helper";
// FEATURE SPECIFIC
export {
  AlphaCodeCheckerSchema,
  CreateSubscriptionSchema,
  SetDefaultPaymentMethodSchema,
} from "./src/api/onboarding";
export {
  AuthCookieSchema,
  QuerySchema,
  SUPPORTED_AUTH_PROVIDERS,
  SupabaseUserSchema,
  UserSchema,
} from "./src/auth";
export type {
  QueryType,
  SupabaseUserType,
  SupportedAuthProvidersType,
  UserType,
} from "./src/auth";

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
