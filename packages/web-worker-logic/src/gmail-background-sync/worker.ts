import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { gmailBackgroundSyncRouter } from "./router";

sharedWorkerAdapter({
  router: gmailBackgroundSyncRouter,
  createContext() {
    return {};
  },
});
