import { ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS } from "../constants";
import { PROVIDER_PROCEDURES } from "../procedure-types";
import { skylarBackendClient } from "../skylar-backend-connector";
import { createGmailApiRouter, gmailApiRouterProcedure } from "../trpc-factory";
import { hasGrantedGoogleGrantedScopes } from "../utils";

export const providerRouter = createGmailApiRouter({
  // make sure router is connected
  health: gmailApiRouterProcedure.query(() => "OK"),
  // Sends a rfc822 message
  addOauthProvider: PROVIDER_PROCEDURES.addOauthProvider.mutation(
    async ({ input, ctx }) => {
      // perform the code exchange
      const emailProviderInfo =
        await skylarBackendClient.oauth.googleCodeExchange.mutate(input);

      // cache
      ctx.tokenStore.set(emailProviderInfo.providerInfo.email, {
        at: emailProviderInfo.accessToken,
        exp: Date.now() + ACCESS_TOKEN_REFRESH_INTERVAL_MILLIS,
      });

      // check scopes
      if (!hasGrantedGoogleGrantedScopes(emailProviderInfo.scope)) {
        throw new Error("Invalid scopes for google account");
      }

      return {
        ...emailProviderInfo.providerInfo,
        emailAddress: emailProviderInfo.providerInfo.email,
        refreshToken: emailProviderInfo.providerInfo.refreshToken, // TODO: encrypt refresh token
      };
    },
  ),
});
