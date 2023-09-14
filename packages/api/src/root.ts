import { onboardingRouter } from "./router/onboarding";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  onboarding: onboardingRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
