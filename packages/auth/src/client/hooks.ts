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

export function useSignInWithGithub({
  onError,
  onSuccess,
}: {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}) {
  const client = useSupabaseClient();
  return async () => {
    const result = await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user user:email",
      },
    });
    if (result.error) {
      return onError?.(result.error);
    }
    console.log("result.data", result.data);
    onSuccess?.();
  };
}

export function useSignInWithDiscord({
  onError,
  onSuccess,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const client = useSupabaseClient();
  return async () => {
    const result = await client.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scopes: "read:user user:email",
      },
    });
    if (result.error) {
      return onError?.(result.error);
    }
    console.log("result.data", result.data);
    onSuccess?.();
  };
}
