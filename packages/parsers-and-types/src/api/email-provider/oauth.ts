import type { Output } from "valibot";
import { enumType, merge, number, object, string } from "valibot";

const baseAuthTokenResponseSchema = object({
  expires_in: number(),
  scope: string(),
  token_type: string(),
  id_token: string(),
});

const oauth2InitialTokenResponseSchema = merge([
  object({
    access_token: string(),
    refresh_token: string(),
  }),
  baseAuthTokenResponseSchema,
]);

const oauth2TokenFromRefreshTokenResponseSchema = merge([
  object({
    access_token: string(),
  }),
  baseAuthTokenResponseSchema,
]);

export const SUPPORTED_EMAIL_PROVIDERS = ["gmail", "outlook"] as const;
const supportedEmailProvidersSchema = enumType(SUPPORTED_EMAIL_PROVIDERS);

export const oauthOnboardingSchema = object({
  code: string(),
  provider: supportedEmailProvidersSchema,
});

export type oauthOnboardingType = Output<typeof oauthOnboardingSchema>;
export type Oauth2InitialTokenResponse = Output<
  typeof oauth2InitialTokenResponseSchema
>;
export type Oauth2TokenFromRefreshTokenResponse = Output<
  typeof oauth2TokenFromRefreshTokenResponseSchema
>;