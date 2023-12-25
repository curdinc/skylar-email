import { sharedWorkerAdapter } from "@skylar/trpc-web-workers";

import { gmailWorkerRouter } from "./router";

sharedWorkerAdapter({
  router: gmailWorkerRouter,
});
