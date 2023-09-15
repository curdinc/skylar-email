export {
  GmailPushNotificationDataObjectSchema,
  GmailPushNotificationSchema,
  gmailProviderIDTokenSchema,
  gmailWatchResponseSchema,
  historyObjectSchema,
  messageResponseSchema,
  type GmailPushNotificationType,
  type MessagePartType,
} from "./src/emailProvider/gmailProvider";

export {
  oauthOnboardingSchema,
  providerEnumList,
  type Oauth2InitialTokenResponse,
  type Oauth2TokenFromRefreshTokenResponse,
  type oauthOnboardingType,
} from "./src/emailProvider/oauth";

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
export { BackendEnvSchema } from "./src/backend/env";
export type { BackendEnvType } from "./src/backend/env";
export { createEnv } from "./src/createEnv";
export {
  ClientEnvSchemaObject,
  ServerEnvSchemaObject,
  SharedEnvSchemaObject,
} from "./src/nextjs/env";
