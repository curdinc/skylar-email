import type { SupabaseUserType, UserType } from "@skylar/schema";

import type { PathType } from "./types/auth-settings";

export function mapSupabaseUserToUser(
  supabaseUser: SupabaseUserType,
): UserType {
  return {
    id: supabaseUser.user_metadata.skylar_id,
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
    provider: supabaseUser.app_metadata.provider,
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
