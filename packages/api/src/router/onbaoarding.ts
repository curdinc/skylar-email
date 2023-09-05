import { TRPCError } from "@trpc/server";

import { AlphaCodeCheckerSchema, validatorTrpcWrapper } from "@skylar/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingRouter = createTRPCRouter({
  validateAlphaCode: protectedProcedure
    .input(validatorTrpcWrapper(AlphaCodeCheckerSchema))
    .mutation(({ ctx: { logger }, input }) => {
      if (input.alphaCode !== "1234") {
        logger.debug(`User code ${input.alphaCode} is not valid`);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please try again",
        });
      }
      return "OK" as const;
    }),
});
