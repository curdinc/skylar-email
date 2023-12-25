import { createTRPCClient, httpLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@skylar/api";

import { loggerLinkConfig } from "../../basic-client/logger-config";

export const skylarBackendClient = createTRPCClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLinkConfig,
    httpLink({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/trpc`,
    }),
  ],
});
