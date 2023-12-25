import { labelRouter } from "./lib/sub-routers/label";
import { messageRouter } from "./lib/sub-routers/message";
import { providerRouter } from "./lib/sub-routers/provider";
import {
  createGmailApiRouter,
  gmailApiRouterProcedure,
} from "./lib/trpc-factory";

export const gmailWorkerRouter = createGmailApiRouter({
  health: gmailApiRouterProcedure.query(() => "OK"),
  label: labelRouter,
  message: messageRouter,
  provider: providerRouter,
});

export type GmailWorkerRouterType = typeof gmailWorkerRouter;
