import { emailClientMeRouter } from "./router/email-client/me";
import { oauthRouter } from "./router/oauth";
import { onboardingRouter } from "./router/onboarding";
import { gmailRouter } from "./router/providers/gmail";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  gmail: gmailRouter,
  onboarding: onboardingRouter,
  stripe: stripeRouter,
  me: emailClientMeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
