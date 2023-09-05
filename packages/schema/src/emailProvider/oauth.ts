import type { Output } from "valibot";
import { enumType, number, object, string } from "valibot";

export const oauth2TokenResponseSchema = object({
  access_token: string(),
  expires_in: number(),
  refresh_token: string(),
  scope: string(),
  token_type: string(),
  id_token: string(),
});

export const providerEnumList = ["gmail", "outlook"] as const;
const providerEnumSchema = enumType(providerEnumList);

export const oauthOnboardingSchema = object({
  code: string(),
  provider: providerEnumSchema,
});

export type oauthOnboardingType = Output<typeof oauthOnboardingSchema>;
