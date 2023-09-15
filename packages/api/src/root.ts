import { gmailRouter } from "./router/gmail";
import { emailProviderRouter } from "./router/oauth";
import { onboardingRouter } from "./router/onboarding";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  emailProviderRouter: emailProviderRouter,
  gmail: gmailRouter,
  onboarding: onboardingRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
