import { getGmailRefreshToken } from "@skylar/db";

import { getAccessToken } from "../../api/src/components/provider_logic/gmail/apimail/api";
import { createTRPCRouter } from "../../api/src/trpc/factory/factory";
import { protectedProcedure } from "../../api/src/trpc/proceduresocedures";

export const gmailRouter = createTRPCRouter({
  getAccessToken: protectedProcedure.query(async ({ ctx }) => {
    const refreshToken = await getGmailRefreshToken({
      db: ctx.db,
      userId: ctx.session.user.userId,
      email: "hansbhatia0342@gmail.com",
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
