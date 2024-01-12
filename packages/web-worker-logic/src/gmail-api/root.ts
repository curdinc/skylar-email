import { labelRouter } from "./src/routers/label";
import { messageRouter } from "./src/routers/message";
import { providerRouter } from "./src/routers/provider";
import { syncRouter } from "./src/routers/sync";
import { threadRouter } from "./src/routers/thread";
import { createGmailApiRouter } from "./src/trpc/factory";
import { publicGmailApiRouterProcedure } from "./src/trpc/procedures";

export const gmailApiWorkerRouter = createGmailApiRouter({
  health: publicGmailApiRouterProcedure.query(() => "OK"),
  label: labelRouter,
  message: messageRouter,
  provider: providerRouter,
  thread: threadRouter,
  sync: syncRouter,
});

export type GmailWorkerRouterType = typeof gmailApiWorkerRouter;
