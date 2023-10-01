import { emailComposeRouter } from "./router/email-compose";
import { emailProviderRouter } from "./router/email-providers";
import { gmailRouter } from "./router/email-providers/gmail";
import { inviteCodeRouter } from "./router/invite-code";
import { oauthRouter } from "./router/oauth";
import { onboardingRouter } from "./router/onboarding";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  onboarding: onboardingRouter,
  stripe: stripeRouter,
  inviteCode: inviteCodeRouter,
  emailProvider: emailProviderRouter,
  gmail: gmailRouter,
  emailCompose: emailComposeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
