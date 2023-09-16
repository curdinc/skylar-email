// export async function userOnboarding({
//   clientId,
//   clientSecret,
//   db,
//   input,
// }: {
//   clientId: string;
//   clientSecret: string;
//   db: DbType;
//   input: oauthOnboardingType;
// }) {
//   if (input.provider !== "gmail") {
//     throw new TRPCError({
//       code: "NOT_IMPLEMENTED",
//       message: "Only gmail is currently supported.",
//     });
//   }
//   //FIXME: const uid = ctx.session?.user?.id;
//   const uid = 1;
//   const parsedResponse = await getAccessToken({
//     clientId: clientId,
//     clientSecret: clientSecret,
//     authorizationCode: input.code,
//     grantType: "authorization_code",
//   });

//   const { payload } = jwt.decode(parsedResponse.id_token);

//   const { email, name } = validatorTrpcWrapper(gmailProviderIDTokenSchema)(
//     payload,
//   );

//   // request inbox watching (gmail)
//   const historyId = await watchGmailInbox(email, parsedResponse.access_token);

//   const userInsertResult = await db
//     .insert(schema.emailProviderOAuth)
//     .values({
//       provider: input.provider,
//       refreshToken: parsedResponse.refresh_token,
//       email: email,
//     })
//     .onConflictDoUpdate({
//       target: [
//         schema.emailProviderOAuth.provider,
//         schema.emailProviderOAuth.email,
//       ],
//       set: {
//         refreshToken: parsedResponse.refresh_token,
//       },
//     })
//     .returning({
//       id: schema.emailProviderOAuth.id,
//     });

//   await db.insert(schema.emailProviderDetails).values({
//     inboxName: email,
//     emailProviderOAuthId: userInsertResult[0]?.id,
//     lastCheckedHistoryId: historyId,
//   });
// }
