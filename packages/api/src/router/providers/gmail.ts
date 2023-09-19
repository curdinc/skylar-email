import {
  GmailPushNotificationSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../../trpc/factory";
import { externalVendorProcedure } from "../../trpc/procedures";

export const gmailRouter = createTRPCRouter({
  incomingEmail: externalVendorProcedure
    .input(validatorTrpcWrapper(GmailPushNotificationSchema))
    .mutation(() => "1"),
  // .mutation(async ({ input, ctx }) => {
  // const parsedData = parse(
  //   GmailPushNotificationDataObjectSchema,
  //   JSON.parse(Buffer.from(input.message.data, "base64").toString("utf-8")),
  // );
  // console.log("parsedData", parsedData);

  // // find refresh token
  // const dbQueryResult = await ctx.db.query.providerAuthDetails.findFirst({
  //   columns: {
  //     refreshToken: true,
  //   },
  //   where: and(
  //     eq(emailProviderOAuth.email, parsedData.emailAddress),
  //     eq(emailProviderOAuth.provider, "gmail"),
  //   ),
  // });

  // if (!dbQueryResult) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     cause: "Refresh token not found.",
  //   });
  // }

  // const parsedResponse = await getAccessToken({
  //   clientId: ctx.env.GOOGLE_PROVIDER_CLIENT_ID,
  //   clientSecret: ctx.env.GOOGLE_PROVIDER_CLIENT_SECRET,
  //   grantType: "refresh_token",
  //   refreshToken: dbQueryResult.refreshToken,
  // });

  // await getAndParseEmails({
  //   accessToken: parsedResponse.access_token,
  //   emailId: parsedData.emailAddress,
  //   startHistoryId: parsedData.historyId.toString(),
  //   logger: ctx.logger,
  //   db: ctx.db,
  // });
});
