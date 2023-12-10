import { emailComposeRouter } from "./router/email-compose";
import { gmailRouter } from "./router/email-providers/gmail";
import { inviteCodeRouter } from "./router/invite-code";
import { mailingListRouter } from "./router/mailing-list";
import { oauthRouter } from "./router/oauth";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  stripe: stripeRouter,
  inviteCode: inviteCodeRouter,
  gmail: gmailRouter,
  emailCompose: emailComposeRouter,
  mailingList: mailingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
