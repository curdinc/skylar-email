"use client";

import {
  useSupabaseClient,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";

import type { UserType } from "@skylar/parsers-and-types";
import { parse, SupabaseUserSchema } from "@skylar/parsers-and-types";

import { mapSupabaseUserToUser } from "../helper";

export function useUser(): UserType | undefined {
  const user = useSupabaseUser();
  if (!user) {
    return undefined;
  }
  return mapSupabaseUserToUser(parse(SupabaseUserSchema, user));
}

export function useSignOut() {
  const client = useSupabaseClient();
  return async () => {
    await client.auth.signOut();
  };
}

type OauthArgs = {
  redirectTo?: string;
  scopes?: string;
};

export function useSignInWithGithub(args?: OauthArgs) {
  const client = useSupabaseClient();
  return async () => {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        ...args,
      },
    });
  };
}

export function useSignInWithDiscord(args?: OauthArgs) {
  const client = useSupabaseClient();
  return async () => {
    await client.auth.signInWithOAuth({
      provider: "discord",
      options: { ...args },
    });
  };
}

export function useSignInWithFacebook(args?: OauthArgs) {
  const client = useSupabaseClient();
  return async () => {
    await client.auth.signInWithOAuth({
      provider: "facebook",
      options: { ...args },
    });
  };
}
