import { DEFAULT_COOKIE_OPTIONS } from "@supabase/auth-helpers-shared";

export const AUTH_TOKEN_COOKIE_NAME = "sb-auth-token";

export const cookieOptions = {
  ...DEFAULT_COOKIE_OPTIONS,
  name: AUTH_TOKEN_COOKIE_NAME,
  secure: true,
};

export const PATHNAME_HEADER = "x-skylar-pathname";
export const QUERY_HEADER = "x-skylar-search";
export const REDIRECT_TO_SEARCH_STRING = "redirectTo";
