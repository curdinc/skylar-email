import { createTRPCClient, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { workerLink } from "@skylar/trpc-web-workers";

import type { GmailWorkerRouterRouter } from "./gmail-worker/router";

export const gmailWorker = createTRPCClient<GmailWorkerRouterRouter>({
  transformer: superjson,
  links: [
    loggerLink(),
    workerLink({
      createWorker: () =>
        new SharedWorker(new URL("./gmail-worker/worker.ts", import.meta.url), {
          name: "gmail-worker",
        }),
    }),
  ],
});
