import { oauthOnboardingSchema, validatorTrpcWrapper } from "@skylar/schema";

import { userOnboarding } from "../components/logic/oauth";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailProviderRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(validatorTrpcWrapper(oauthOnboardingSchema))
    .mutation(async ({ ctx, input }) => {
      await userOnboarding(ctx.db, input);
    }),
});
