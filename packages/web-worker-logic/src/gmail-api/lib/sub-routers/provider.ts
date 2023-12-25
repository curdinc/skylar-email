import { putProvider } from "@skylar/client-db";

import { ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS } from "../constants";
import { PROVIDER_PROCEDURES } from "../procedure-types";
import { skylarBackendClient } from "../skylar-backend-connector";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc-factory";

export const providerRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // Sends a rfc822 message
  addOauthProvider: PROVIDER_PROCEDURES.addOauthProvider.mutation(
    async ({ input, ctx }) => {
      // perform the code exchange
      const emailProviderInfo =
        await skylarBackendClient.oauth.googleCodeExchange.mutate(input);

      // add to clientDb
      await putProvider({
        provider: {
          type: emailProviderInfo.providerType,
          user_email_address: emailProviderInfo.providerInfo.email,
          image_uri: emailProviderInfo.providerInfo.imageUri,
          inbox_name: emailProviderInfo.providerInfo.name,
          refresh_token: emailProviderInfo.providerInfo.refreshToken,
          access_token: emailProviderInfo.accessToken,
        },
      });

      ctx.tokenStore.set(emailProviderInfo.providerInfo.email, {
        at: emailProviderInfo.accessToken,
        exp: Date.now() + ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS,
      });

      return emailProviderInfo.providerInfo.email;
    },
  ),
});
