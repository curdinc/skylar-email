"use client";

import {
  useSupabaseClient,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";

import type { User } from "../types/user";

export function useUser(): User | undefined {
  const user = useSupabaseUser();
  return user ?? undefined;
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
