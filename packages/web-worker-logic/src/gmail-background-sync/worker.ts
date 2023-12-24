import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { gmailBackgroundSyncRouter } from "./router";

// store access tokens in memory: email address -> {accessToken, expiresAt}
// const accessTokens = new Map<string, { token: string; exp: number }>();

sharedWorkerAdapter({
  router: gmailBackgroundSyncRouter,
});