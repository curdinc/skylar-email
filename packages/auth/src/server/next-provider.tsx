import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { parse, QuerySchema } from "@skylar/schema";

import { SupabaseAuthClientProvider } from "../client/next-provider";
import { cookieOptions } from "../constants";
import { isPathEqual, pathToString } from "../helper";
import type { AuthSettingServerType } from "../types/auth-settings";

const getCurrentPath = () => {
  const headersList = headers();
  const activePath = headersList.get("x-invoke-path");
  return activePath ?? "/";
};
const getCurrentQuery = () => {
  const headersList = headers();
  const activeQuery = headersList.get("x-invoke-query");
  const query = decodeURIComponent(activeQuery ?? "{}");
  return new URLSearchParams(parse(QuerySchema, JSON.parse(query))) ?? {};
};

export const defaultOnLoginRedirectTo = () => {
  const query = getCurrentQuery();
  const redirectTo = query.get("redirectTo");
  if (redirectTo) {
    return { path: redirectTo };
  }
  return { path: "/" };
};

export const doNotRedirect = (currentRoute: string) => {
  return { path: currentRoute };
};

export async function NextAuthProvider({
  children,
  supabaseKey,
  supabaseUrl,
  authSettings,
}: {
  children: React.ReactNode;
  supabaseKey: string;
  supabaseUrl: string;
  authSettings?: AuthSettingServerType;
}) {
  const supabase = createRouteHandlerClient(
    { cookies },
    {
      supabaseKey,
      supabaseUrl,
      cookieOptions,
    },
  );
  const session = await supabase.auth.getSession();

  const pathName = getCurrentPath();
  const queryParams = getCurrentQuery();

  const currentPath = {
    path: pathName,
    queryParams,
  };
  // we do not guard if there is a `code` query param bc supabase uses that to do auth on the client side after the page loads.
  // a little hacky right now
  if (
    authSettings?.guardByDefault &&
    !session.data.session &&
    !queryParams.has("code")
  ) {
    if (typeof authSettings.onUnauthenticatedRedirectTo === "object") {
      if (!isPathEqual(authSettings.onUnauthenticatedRedirectTo, currentPath)) {
        redirect(pathToString(authSettings.onUnauthenticatedRedirectTo));
      }
    } else if (typeof authSettings.onUnauthenticatedRedirectTo === "function") {
      const newRoute = await authSettings.onUnauthenticatedRedirectTo(
        pathName,
        queryParams,
      );
      if (!isPathEqual(newRoute, currentPath)) {
        redirect(pathToString(newRoute));
      }
    }
  }

  if (authSettings?.guardByDefault === false && session.data.session) {
    if (typeof authSettings.onAuthenticatedRedirectTo === "object") {
      if (!isPathEqual(authSettings.onAuthenticatedRedirectTo, currentPath)) {
        redirect(pathToString(authSettings.onAuthenticatedRedirectTo));
      }
    } else if (typeof authSettings.onAuthenticatedRedirectTo === "function") {
      const newRoute = await authSettings.onAuthenticatedRedirectTo(
        pathName,
        queryParams,
      );
      if (!isPathEqual(newRoute, currentPath)) {
        redirect(pathToString(newRoute));
      }
    }
  }

  return (
    <SupabaseAuthClientProvider
      initialSession={session.data.session}
      supabaseKey={supabaseKey}
      supabaseUrl={supabaseUrl}
    >
      {children}
    </SupabaseAuthClientProvider>
  );
}
