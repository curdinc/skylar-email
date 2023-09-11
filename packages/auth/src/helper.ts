/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { User as SupabaseUser } from "@supabase/supabase-js";

import type { UserType } from "@skylar/schema";

import type { PathType } from "./types/auth-settings";

export function mapSupabaseUserToUser(
  supabaseUser: Omit<SupabaseUser, "created_at" | "id">,
): UserType {
  console.log("supabaseUser", supabaseUser);
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

export const isPathEqual = (path1: PathType, path2: PathType) => {
  path1.queryParams?.sort();
  path2.queryParams?.sort();
  return pathToString(path1) === pathToString(path2);
};

export const pathToString = (path: PathType) => {
  return (path.queryParams?.size ?? 0) > 0
    ? `${path.path}?${path.queryParams?.toString()}`
    : path.path;
};
