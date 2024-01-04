import { gmailRouter } from "./routers/email-providers/gmail";
import { inviteCodeRouter } from "./routers/invite-code";
import { mailingListRouter } from "./routers/mailing-list";
import { oauthRouter } from "./routers/oauth";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  inviteCode: inviteCodeRouter,
  gmail: gmailRouter,
  mailingList: mailingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
