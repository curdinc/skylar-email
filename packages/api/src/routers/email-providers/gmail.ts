import { getAccessToken } from "@skylar/gmail-api";
import {
  getGmailAccessTokenSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../../trpc/factory";
import { publicProcedure } from "../../trpc/procedures";

export const gmailRouter = createTRPCRouter({
  getAccessToken: publicProcedure
    .input(validatorTrpcWrapper(getGmailAccessTokenSchema))
    .mutation(async ({ ctx, input }) => {
      const accessTokenResponse = await getAccessToken({
        clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
        grantType: "refresh_token",
        refreshToken: input.refreshToken,
      });

      return {
        accessToken: accessTokenResponse.access_token,
        expiresIn: accessTokenResponse.expires_in,
        scope: accessTokenResponse.scope,
        tokenType: accessTokenResponse.token_type,
      };
    }),
});
