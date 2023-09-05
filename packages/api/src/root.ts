import { blankRouter } from "./router/blank";
import { onboardingRouter } from "./router/onbaoarding";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  blank: blankRouter,
  onboarding: onboardingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
