import { createTRPCClient, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { workerLink } from "@skylar/trpc-web-workers";

import type { GmailWorkerRouterType } from "./gmail-api/router";
import type { GmailBackgroundSyncRouterType } from "./gmail-background-sync/router";

const loggerLinkConfig = loggerLink({
  enabled: (opts) => opts.direction === "down" && opts.result instanceof Error,
});

export const gmailApiWorker = createTRPCClient<GmailWorkerRouterType>({
  transformer: superjson,
  links: [
    loggerLinkConfig,
    workerLink({
      createWorker: () => {
        return new SharedWorker(
          new URL("./gmail-api/worker.ts", import.meta.url),
          {
            name: "gmail-api-worker",
          },
        );
      },
    }),
  ],
});

export const gmailBackgroundSyncWorker = (emailAddress: string) =>
  createTRPCClient<GmailBackgroundSyncRouterType>({
    transformer: superjson,
    links: [
      loggerLinkConfig,
      workerLink({
        createWorker: () => {
          return new SharedWorker(
            new URL("./gmail-background-sync/worker.ts", import.meta.url),
            {
              name: `gmail-background-sync-worker-${emailAddress}`,
            },
          );
        },
      }),
    ],
  });
