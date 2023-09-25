import { getGmailRefreshToken } from "@skylar/db";
import { getAccessToken } from "@skylar/gmail-api";
import {
  GetGmailAccessTokenSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../../trpc/factory";
import { protectedProcedure } from "../../trpc/procedures";

export const gmailRouter = createTRPCRouter({
  getAccessToken: protectedProcedure
    .input(validatorTrpcWrapper(GetGmailAccessTokenSchema))
    .mutation(async ({ ctx, input }) => {
      const refreshToken = await getGmailRefreshToken({
        db: ctx.db,
        userId: ctx.session.user.userId,
        email: input.email,
      });

      const accessTokenResponse = await getAccessToken({
        clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
        grantType: "refresh_token",
        refreshToken: refreshToken,
      });

      return accessTokenResponse.access_token;
    }),
});
