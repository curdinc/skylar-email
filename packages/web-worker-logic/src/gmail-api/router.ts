import { labelRouter } from "./lib/sub-routers/label";
import { messageRouter } from "./lib/sub-routers/message";
import { providerRouter } from "./lib/sub-routers/provider";
import { syncRouter } from "./lib/sub-routers/sync";
import { threadRouter } from "./lib/sub-routers/thread";
import {
  createGmailApiRouter,
  gmailApiRouterProcedure,
} from "./lib/trpc-factory";

export const gmailWorkerRouter = createGmailApiRouter({
  health: gmailApiRouterProcedure.query(() => "OK"),
  label: labelRouter,
  message: messageRouter,
  provider: providerRouter,
  thread: threadRouter,
  sync: syncRouter,
});

export type GmailWorkerRouterType = typeof gmailWorkerRouter;
