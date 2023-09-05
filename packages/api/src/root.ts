import { blankRouter } from "./router/blank";
import { emailProviderRouter } from "./router/emailProvider";
import { gmailRouter } from "./router/gmail";
import { onboardingRouter } from "./router/onboarding";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  blank: blankRouter,
  emailProviderRouter: emailProviderRouter,
  gmail: gmailRouter,
  onboarding: onboardingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
