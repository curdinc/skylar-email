import {
  oauthOnboardingSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { userOnboarding } from "../components/logic/oauthOnboarding";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailProviderRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(validatorTrpcWrapper(oauthOnboardingSchema))
    .mutation(async ({ ctx, input }) => {
      await userOnboarding({
        db: ctx.db,
        input: input,
        clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
      });
    }),
});
