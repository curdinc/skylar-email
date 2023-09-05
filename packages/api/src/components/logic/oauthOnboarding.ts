import { TRPCError } from "@trpc/server";
import jwt from "@tsndr/cloudflare-worker-jwt";

import type { DbType } from "@skylar/db";
import { schema } from "@skylar/db";
import type { oauthOnboardingType } from "@skylar/schema";
import {
  gmailProviderIDTokenSchema,
  oauth2TokenResponseSchema,
  validatorTrpcWrapper,
} from "@skylar/schema";

import { getAccessToken, watchGmailInbox } from "../providerLogic/gmail";

export async function userOnboarding({
  clientId,
  clientSecret,
  db,
  input,
}: {
  clientId: string;
  clientSecret: string;
  db: DbType;
  input: oauthOnboardingType;
}) {
  if (input.provider !== "gmail") {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Only gmail is currently supported.",
    });
  }
  //FIXME: const uid = ctx.session?.user?.id;
  const uid = 1;
  const res = await getAccessToken({
    clientId: clientId,
    clientSecret: clientSecret,
    payload: input.code,
    fromRefresh: false,
  });

  const parsedResponse = validatorTrpcWrapper(oauth2TokenResponseSchema)(
    await res.json(),
  );

  const { payload } = jwt.decode(parsedResponse.id_token);

  const { email, name } = validatorTrpcWrapper(gmailProviderIDTokenSchema)(
    payload,
  );

  // request inbox watching (gmail)
  const historyId = await watchGmailInbox(email, parsedResponse.access_token);

  await db
    .insert(schema.providerAuthDetails)
    .values({
      provider: input.provider,
      refreshToken: parsedResponse.refresh_token,
      userId: uid,
      email: email,
      name: name,
      lastCheckedHistoryId: historyId,
    })
    .onConflictDoUpdate({
      target: [
        schema.providerAuthDetails.userId,
        schema.providerAuthDetails.provider,
        schema.providerAuthDetails.email,
      ],
      set: {
        refreshToken: parsedResponse.refresh_token,
        name: name,
      },
    });
}
