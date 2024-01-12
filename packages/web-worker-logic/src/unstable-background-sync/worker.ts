import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { gmailBackgroundSyncRouter } from "./root";

// FIXME: this worker is not currently used since the shared workers do not have
// the ability to "spawn" another worker

// ideally this worker would be used to run a full background sync for any provider
// it's not super hard - the trpc "sharedWorkerAdapter" can be configured to take in
// a port instead of constructing a worker directly

sharedWorkerAdapter({
  router: gmailBackgroundSyncRouter,
  createContext() {
    return {};
  },
});
