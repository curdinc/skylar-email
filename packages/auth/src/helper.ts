/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { User as SupabaseUser } from "@supabase/supabase-js";

import type { User } from "./types/user";

export function mapSupabaseUserToUser(
  supabaseUser: Omit<SupabaseUser, "created_at" | "id">,
): User {
  return {
    name:
      supabaseUser.user_metadata.full_name ??
      supabaseUser.user_metadata.name ??
      supabaseUser.user_metadata.preferred_username ??
      supabaseUser.user_metadata.user_name ??
      supabaseUser.user_metadata.nickname ??
      "",
    imageUri:
      supabaseUser.user_metadata.picture ??
      supabaseUser.user_metadata.avatar_url ??
      "",
    email: supabaseUser.email ?? supabaseUser.user_metadata.email,
    phone: supabaseUser.phone,
    providers: supabaseUser.app_metadata.providers,
    providerId: supabaseUser.user_metadata.sub,
  };
}
