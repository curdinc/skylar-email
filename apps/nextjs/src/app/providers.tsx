"use client";

import { useCallback, useState } from "react";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import { AUTH_TOKEN_COOKIE_NAME, AuthListener } from "@skylar/auth/client";

import { env } from "~/env";
import { api } from "~/lib/api";
import { onLogoutRedirectTo, useOnUserLogin } from "~/lib/auth/client";

export function TRPCReactProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
  cookies: RequestCookie[];
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: env.NEXT_PUBLIC_BACKEND_URL,
          headers() {
            const headers = new Map(props.headers);
            const auth = props.cookies.find((cookie) => {
              return cookie.name === AUTH_TOKEN_COOKIE_NAME;
            });
            headers.set("x-trpc-source", "nextjs-react");
            headers.set("Authorization", `Bearer ${auth?.value}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration transformer={superjson}>
          {props.children}
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </api.Provider>
  );
}

export function AuthListenerSkylar({
  supabaseKey,
  supabaseUrl,
}: {
  supabaseKey: string;
  supabaseUrl: string;
}) {
  const onLogoutRedirectToFn = useCallback(onLogoutRedirectTo, []);
  const { onUserLogin } = useOnUserLogin();

  return (
    <AuthListener
      supabaseKey={supabaseKey}
      supabaseUrl={supabaseUrl}
      onLogoutRedirectTo={onLogoutRedirectToFn}
      onLogin={onUserLogin}
    />
  );
}
