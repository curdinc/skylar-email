import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@skylar/api";
import { AUTH_TOKEN_COOKIE_NAME } from "@skylar/auth/client";

import { state$ } from ".";

// Not used right now, we'll try a hybrid where the server query and mutation happens in the app, while in app logic happens here.
export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        state$.env.NODE_ENV.get() === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: state$.env.NEXT_PUBLIC_BACKEND_URL.get(),
      headers() {
        const headers = state$.env.getHeaders();
        const cookieValue = state$.env.getCookieValue(AUTH_TOKEN_COOKIE_NAME);
        headers["x-trpc-source"] = "nextjs-react";
        headers.Authorization = `Bearer ${cookieValue}`;
        return headers;
      },
    }),
  ],
});
