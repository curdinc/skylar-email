import { blankRouter } from "./router/blank";
import { emailProviderRouter } from "./router/emailProvider";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  blank: blankRouter,
  emailProviderRouter: emailProviderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
