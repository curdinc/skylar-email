import type { Output } from "valibot";
import {
  array,
  boolean,
  coerce,
  email,
  enumType,
  nullable,
  object,
  optional,
  record,
  string,
  url,
} from "valibot";

import { coerceNullToUndefined } from "../utils/coerce";

export const AuthCookieSchema = array(nullable(string()));

export const SUPPORTED_AUTH_PROVIDERS = [
  "github",
  "discord",
  "facebook",
  "google",
] as const;
export type SupportedAuthProvidersType =
  (typeof SUPPORTED_AUTH_PROVIDERS)[number];

export const UserSchema = object({
  email: coerce(optional(string([email()])), coerceNullToUndefined(String)),
  phone: coerce(optional(string()), coerceNullToUndefined(String)),
  imageUri: coerce(optional(string([url()])), coerceNullToUndefined(String)),
  name: string(),
  provider: enumType(SUPPORTED_AUTH_PROVIDERS),
  providerId: string(),
});

export type UserType = Output<typeof UserSchema>;

export const SupabaseUserSchema = object({
  email: coerce(optional(string([email()])), coerceNullToUndefined(String)),
  phone: coerce(optional(string()), coerceNullToUndefined(String)),
  aud: string(),
  app_metadata: object({
    provider: enumType(SUPPORTED_AUTH_PROVIDERS),
    providers: array(enumType(SUPPORTED_AUTH_PROVIDERS)),
  }),
  user_metadata: object({
    avatar_url: coerce(
      optional(string([url()])),
      coerceNullToUndefined(String),
    ),
    picture: coerce(optional(string([url()])), coerceNullToUndefined(String)),
    full_name: coerce(optional(string()), coerceNullToUndefined(String)),
    name: coerce(optional(string()), coerceNullToUndefined(String)),
    preferred_username: coerce(
      optional(string()),
      coerceNullToUndefined(String),
    ),
    user_name: coerce(optional(string()), coerceNullToUndefined(String)),
    nickname: coerce(optional(string()), coerceNullToUndefined(String)),
    email: coerce(optional(string([email()])), coerceNullToUndefined(String)),
    email_verified: optional(boolean()),
    sub: string(),
  }),
});
export type SupabaseUserType = Output<typeof SupabaseUserSchema>;

export const QuerySchema = record(string());
export type QueryType = Output<typeof QuerySchema>;
