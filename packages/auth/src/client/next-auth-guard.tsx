"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

import { cookieOptions } from "../constants";
import { isPathEqual, pathToString } from "../helper";
import type { AuthSettingClientType } from "../types/auth-settings";

export function AuthListener({
  supabaseKey,
  supabaseUrl,
  onLogin,
  onLogout,
  onLoginRedirectTo,
  onLogoutRedirectTo,
}: {
  supabaseKey: string;
  supabaseUrl: string;
  onLogin?: AuthSettingClientType["onLogin"];
  onLogout?: AuthSettingClientType["onLogout"];
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
          await onLogout?.(currentPath);
          if (typeof onLogoutRedirectTo === "function") {
            const newRoute = await onLogoutRedirectTo(currentPath);
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
          await onLogin?.(currentPath);

          if (typeof onLoginRedirectTo === "function") {
            const newRoute = await onLoginRedirectTo(currentPath);
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
    onLogin,
    onLoginRedirectTo,
    onLogout,
    onLogoutRedirectTo,
    pathName,
    router,
    searchParams,
    supabaseClient.auth,
  ]);

  return <></>;
}
