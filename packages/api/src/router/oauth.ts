import { TRPCError } from "@trpc/server";
import jwt from "@tsndr/cloudflare-worker-jwt";

import { insertEmailProviderDetail, insertGmailProvider } from "@skylar/db";
import { getAccessToken } from "@skylar/gmail-api";
import {
  gmailProviderIDTokenSchema,
  oauthOnboardingSchema,
  parse,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { protectedProcedure } from "../trpc/procedures";

export const oauthRouter = createTRPCRouter({
  googleCodeExchange: protectedProcedure
    .input(validatorTrpcWrapper(oauthOnboardingSchema))
    .mutation(
      async ({
        ctx: {
          env,
          db,
          session: { user },
        },
        input,
      }) => {
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

        const emailProviderDetail = await insertEmailProviderDetail({
          db,
          input: {
            email,
            emailProvider: input.provider,
            inboxName: name,
            userId: user.userId,
            imageUri: picture,
          },
        });
        if (!emailProviderDetail) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to insert email provider detail.",
          });
        }

        const gmailProvider = await insertGmailProvider({
          db,
          input: {
            emailProviderDetailId: emailProviderDetail?.emailProviderDetailId,
            // TODO: encrypt refresh token
            refreshToken: parsedResponse.refresh_token,
          },
        });

        if (!gmailProvider) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to insert gmail provider.",
          });
        }

        return {
          email,
          idToken: parsedResponse.id_token,
          accessToken: parsedResponse.access_token,
          tokenType: parsedResponse.token_type,
          scope: parsedResponse.scope,
        };
      },
    ),
});
