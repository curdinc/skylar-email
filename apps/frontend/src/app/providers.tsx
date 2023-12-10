"use client";

import { useState } from "react";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import superjson from "superjson";

import { env } from "~/env";
import { api } from "~/lib/api";

/**
 * This wraps the entire app with the client providers needed.
 * * TRPC Client
 * * React Query Client
 * * Google OAuth Provider
 * @param props
 * @returns
 */
export function ClientProvider(props: {
  children: React.ReactNode;
  headers?: Headers;
  cookies: RequestCookie[];
  googleProviderClientId: string;
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
            headers.set("x-trpc-source", "nextjs-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <GoogleOAuthProvider clientId={props.googleProviderClientId}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryStreamedHydration transformer={superjson}>
            {props.children}
          </ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </api.Provider>
    </GoogleOAuthProvider>
  );
}
