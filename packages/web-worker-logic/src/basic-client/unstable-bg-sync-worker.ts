// import { createTRPCClient } from "@trpc/client";
// import superjson from "superjson";

// import { workerLink } from "@skylar/trpc-web-workers";

// import type { GmailBackgroundSyncRouterType } from "../gmail-background-sync/root";
// import { loggerLinkConfig } from "../lib/logger-config";

// export const gmailBackgroundSyncWorker = (emailAddress: string) =>
//   createTRPCClient<GmailBackgroundSyncRouterType>({
//     transformer: superjson,
//     links: [
//       loggerLinkConfig,
//       workerLink({
//         createWorker: () => {
//           return new SharedWorker(
//             new URL("../gmail-background-sync/worker.ts", import.meta.url),
//             {
//               name: `gmail-background-sync-worker-${emailAddress}`,
//             },
//           );
//         },
//       }),
//     ],
//   });
