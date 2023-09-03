import { createTRPCRouter, publicProcedure } from "../trpc";

export const blankRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
