import { TRPCError } from "@trpc/server";

import { and, eq } from "@skylar/db";
import { emailProviderOAuth } from "@skylar/db/schema/emailProviders";
import {
  GmailPushNotificationDataObjectSchema,
  GmailPushNotificationSchema,
  parse,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { getAccessToken } from "../components/providerLogic/gmail/api";
import { getAndParseEmails } from "../components/providerLogic/gmail/getAndParseEmails";
import { createTRPCRouter, externalVendorProcedure } from "../trpc";

export const gmailRouter = createTRPCRouter({
  incomingEmail: externalVendorProcedure
    .input(validatorTrpcWrapper(GmailPushNotificationSchema))
    .mutation(async ({ input, ctx }) => {
      const uid = 1;
      //console.log("input.message.data", input.message.data);
      //const data = input.message.data;
      const parsedData = parse(
        GmailPushNotificationDataObjectSchema,
        JSON.parse(Buffer.from(input.message.data, "base64").toString("utf-8")),
      );
      console.log("parsedData", parsedData);

      const dbQueryResult = await ctx.db.query.providerAuthDetails.findFirst({
        columns: {
          refreshToken: true,
        },
        where: and(
          eq(emailProviderOAuth.email, parsedData.emailAddress),
          eq(emailProviderOAuth.provider, "gmail"),
        ),
      });

      if (!dbQueryResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Refresh token not found.",
        });
      }

      const parsedResponse = await getAccessToken({
        clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
        grantType: "refresh_token",
        refreshToken: dbQueryResult.refreshToken,
      });

      await getAndParseEmails({
        accessToken: parsedResponse.access_token,
        emailId: parsedData.emailAddress,
        startHistoryId: parsedData.historyId.toString(),
        logger: ctx.logger,
        db: ctx.db,
      });

      return;
    }),
});
