import type { Output } from "valibot";
import {
  array,
  boolean,
  email,
  enumType,
  nullable,
  object,
  optional,
  record,
  string,
  url,
} from "valibot";

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
  email: optional(string([email()])),
  phone: optional(string()),
  imageUri: optional(string([url()])),
  name: string(),
  provider: enumType(SUPPORTED_AUTH_PROVIDERS),
  providerId: string(),
});

export type UserType = Output<typeof UserSchema>;

export const SupabaseUserSchema = object({
  email: optional(string([email()])),
  phone: optional(string()),
  aud: string(),
  app_metadata: object({
    provider: enumType(SUPPORTED_AUTH_PROVIDERS),
    providers: array(enumType(SUPPORTED_AUTH_PROVIDERS)),
  }),
  user_metadata: object({
    avatar_url: optional(string([url()])),
    picture: optional(string([url()])),
    full_name: optional(string()),
    name: optional(string()),
    preferred_username: optional(string()),
    user_name: optional(string()),
    nickname: optional(string()),
    email: optional(string([email()])),
    email_verified: optional(boolean()),
    sub: string(),
  }),
});
export type SupabaseUserType = Output<typeof SupabaseUserSchema>;

export const QuerySchema = record(string());
export type QueryType = Output<typeof QuerySchema>;
