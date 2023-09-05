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

export async function userOnboarding(db: DbType, input: oauthOnboardingType) {
  if (input.provider !== "gmail") {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Only gmail is currently supported.",
    });
  }
  //FIXME: const uid = ctx.session?.user?.id;
  const uid = 1;
  //FIXME: inject env vars here
  const data = new URLSearchParams({
    client_id: "process.env.GOOGLE_PROVIDER_CLIENT_ID",
    client_secret: "process.env.GOOGLE_PROVIDER_CLIENT_SECRET",
    redirect_uri: "postmessage",
    grant_type: "authorization_code",
    code: input.code,
  });

  const res = await fetch(
    "https://oauth2.googleapis.com/token?" + data.toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const parsedResponse = validatorTrpcWrapper(oauth2TokenResponseSchema)(
    await res.json(),
  );

  const { payload } = jwt.decode(parsedResponse.id_token);

  const { email, name } = validatorTrpcWrapper(gmailProviderIDTokenSchema)(
    payload,
  );

  await db
    .insert(schema.providerAuthDetails)
    .values({
      provider: input.provider,
      refreshToken: parsedResponse.refresh_token,
      userId: uid,
      email: email,
      name: name,
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
