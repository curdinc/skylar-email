import { onboardingRouter } from "./router/onboarding";
import { createTRPCRouter } from "./trpc/factory";

export const appRouter = createTRPCRouter({
  onboarding: onboardingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
