import { labelRouter } from "./lib/routers/label";
import { messageRouter } from "./lib/routers/message";
import { providerRouter } from "./lib/routers/provider";
import { syncRouter } from "./lib/routers/sync";
import { threadRouter } from "./lib/routers/thread";
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
