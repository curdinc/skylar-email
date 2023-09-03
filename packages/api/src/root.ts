import { blankRouter } from "./router/blank";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  blank: blankRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
