import { blankRouter } from "./router/blank";
import { emailProviderRouter } from "./router/emailProvider";
import { gmailRouter } from "./router/gmail";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  blank: blankRouter,
  emailProviderRouter: emailProviderRouter,
  gmail: gmailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
