import { TRPCError } from "@trpc/server";
import jwt from "@tsndr/cloudflare-worker-jwt";

import { getAccessToken } from "@skylar/gmail-api";
import {
  gmailProviderIDTokenSchema,
  oauthOnboardingSchema,
  parse,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { publicProcedure } from "../trpc/procedures";

export const oauthRouter = createTRPCRouter({
  googleCodeExchange: publicProcedure
    .input(validatorTrpcWrapper(oauthOnboardingSchema))
    .mutation(async ({ ctx: { env }, input }) => {
      if (input.provider !== "gmail") {
        throw new TRPCError({
          code: "NOT_IMPLEMENTED",
          message: "Only gmail is currently supported.",
        });
      }
      const parsedResponse = await getAccessToken({
        clientId: env.GOOGLE_PROVIDER_CLIENT_ID,
        clientSecret: env.GOOGLE_PROVIDER_CLIENT_SECRET,
        authorizationCode: input.code,
        grantType: "authorization_code",
      });

      const { payload } = jwt.decode(parsedResponse.id_token);

      const { email, name, picture } = parse(
        gmailProviderIDTokenSchema,
        payload,
      );

      return {
        idToken: parsedResponse.id_token,
        accessToken: parsedResponse.access_token,
        tokenType: parsedResponse.token_type,
        scope: parsedResponse.scope,
        providerType: input.provider,
        providerInfo: {
          email,
          name,
          imageUri: picture ?? "",
          refreshToken: parsedResponse.refresh_token,
        },
      };
    }),
});
