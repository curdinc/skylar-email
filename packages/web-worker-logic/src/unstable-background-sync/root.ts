import { syncRouter } from "./src/routers/sync";
import { createGmailBgSyncRouter } from "./src/trpc/factory";
import { publicGmailBgSyncProcedure } from "./src/trpc/procedures";

export const gmailBackgroundSyncRouter = createGmailBgSyncRouter({
  health: publicGmailBgSyncProcedure.query(() => "OK"),
  sync: syncRouter,
});

export type GmailBackgroundSyncRouterType = typeof gmailBackgroundSyncRouter;
