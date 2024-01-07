import { createTRPCClient, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { workerLink } from "@skylar/trpc-web-workers";

import type { GmailWorkerRouterType } from "../gmail-api/root";

export const gmailApiWorker = createTRPCClient<GmailWorkerRouterType>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        opts.direction === "down" && opts.result instanceof Error,
    }),
    workerLink({
      createWorker: () => {
        return new SharedWorker(
          new URL("../gmail-api/worker.ts", import.meta.url),
          {
            name: "gmail-api-worker",
          },
        );
      },
    }),
  ],
});
