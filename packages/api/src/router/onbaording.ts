import { AlphaCodeCheckerSchema, validatorTrpcWrapper } from "@skylar/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingRouter = createTRPCRouter({
  validateAlphaCode: protectedProcedure
    .input(validatorTrpcWrapper(AlphaCodeCheckerSchema))
    .mutation(({ ctx, input }) => {
      console.log("input.alphaCode", input.alphaCode);
      return "you can see this secret message!";
    }),
});
