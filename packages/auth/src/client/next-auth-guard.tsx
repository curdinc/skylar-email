"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

import { cookieOptions } from "../constants";
import { isPathEqual, pathToString } from "../helper";
import type { AuthSettingClientType } from "../types/auth-settings";

export function AuthGuard({
  supabaseKey,
  supabaseUrl,
  onLoginRedirectTo,
  onLogoutRedirectTo,
}: {
  supabaseKey: string;
  supabaseUrl: string;
  onLoginRedirectTo?: AuthSettingClientType["onLoginRedirectTo"];
  onLogoutRedirectTo?: AuthSettingClientType["onLogoutRedirectTo"];
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions,
      supabaseKey,
      supabaseUrl,
    }),
  );
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const modifiableSearchParams = new URLSearchParams(searchParams);
    const currentPath = {
      path: pathName,
      queryParams: modifiableSearchParams,
    };
    const signOutListener = supabaseClient.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          if (typeof onLogoutRedirectTo === "function") {
            const newRoute = await onLogoutRedirectTo(
              pathName,
              modifiableSearchParams,
            );
            if (!isPathEqual(newRoute, currentPath)) {
              router.push(pathToString(newRoute));
            }
          } else if (typeof onLogoutRedirectTo === "object") {
            if (!isPathEqual(onLogoutRedirectTo, currentPath)) {
              router.push(pathToString(onLogoutRedirectTo));
            }
          }
        }
        if (event === "SIGNED_IN") {
          if (typeof onLoginRedirectTo === "function") {
            const newRoute = await onLoginRedirectTo(
              pathName,
              modifiableSearchParams,
            );
            if (!isPathEqual(newRoute, currentPath)) {
              router.push(pathToString(newRoute));
            }
          } else if (typeof onLoginRedirectTo === "object") {
            if (!isPathEqual(onLoginRedirectTo, currentPath)) {
              router.push(pathToString(onLoginRedirectTo));
            }
          }
        }
      },
    );
    return () => {
      signOutListener.data.subscription.unsubscribe();
    };
  }, [
    onLoginRedirectTo,
    onLogoutRedirectTo,
    pathName,
    router,
    searchParams,
    supabaseClient.auth,
  ]);

  return <></>;
}
