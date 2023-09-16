import {
  oauthOnboardingSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { publicProcedure } from "../trpc/procedures";

export const emailProviderRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(validatorTrpcWrapper(oauthOnboardingSchema))
    .mutation(() => "1"),
  // .mutation(async ({ ctx, input }) => {
  // await userOnboarding({
  //   db: ctx.db,
  //   input: input,
  //   clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
  //   clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
  // });
});
