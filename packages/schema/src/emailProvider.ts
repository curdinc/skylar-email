import { boolean, enumType, number, object, string } from "valibot";

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

export const authCodeSchema = object({
  code: string(),
  provider: providerEnumSchema,
});

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
