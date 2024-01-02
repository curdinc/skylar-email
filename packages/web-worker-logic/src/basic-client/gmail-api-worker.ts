import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";

import { workerLink } from "@skylar/trpc-web-workers";

import type { GmailWorkerRouterType } from "../gmail-api/router";
import { loggerLinkConfig } from "./logger-config";

export const gmailApiWorker = createTRPCClient<GmailWorkerRouterType>({
  transformer: superjson,
  links: [
    loggerLinkConfig,
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
