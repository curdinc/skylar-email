import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@skylar/api";

import { env } from "~/env.mjs";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:8787/trpc"
          : env.NEXT_PUBLIC_BACKEND_URL,
    }),
  ],
  transformer: superjson,
});
