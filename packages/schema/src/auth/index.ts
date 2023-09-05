import type { Output } from "valibot";
import {
  array,
  boolean,
  email,
  enumType,
  nullable,
  object,
  optional,
  string,
  url,
} from "valibot";

export const AuthCookieSchema = array(nullable(string()));

export const UserSchema = object({
  email: optional(string([email()])),
  phone: optional(string()),
  imageUri: optional(string([url()])),
  name: string(),
  providers: array(enumType(["github", "discord", "facebook", "google"])),
  providerId: string(),
});

export type UserType = Output<typeof UserSchema>;

export const SupabaseUserSchema = object({
  email: optional(string([email()])),
  phone: optional(string()),
  app_metadata: object({
    provider: enumType(["github", "discord", "facebook", "google"]),
    providers: array(enumType(["github", "discord", "facebook", "google"])),
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
