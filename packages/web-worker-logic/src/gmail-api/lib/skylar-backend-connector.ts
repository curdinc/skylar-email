import { createTRPCClient, httpLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@skylar/api";

export const skylarBackendClient = createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink(),
    httpLink({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/trpc`,
    }),
  ],
});
